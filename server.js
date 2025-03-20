const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const sql = require('mssql');
const notifier = require('node-notifier'); // สำหรับการแจ้งเตือน

const app = express();
app.set('trust proxy', true); // ตั้งค่า trust proxy เพื่อจับ IP แท้จริง
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;


// Middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// กำหนดการเชื่อมต่อกับ Microsoft SQL Server
const dbConfig = {
  user: 'sa',
  password: 'Pa$$w0rd',
  server: 'localhost',
  database: 'INTRANET',
  options: {
    encrypt: false, // เปลี่ยนเป็น true หากใช้ Azure หรือ SSL
    trustServerCertificate: true,
  },
};

// สร้าง connection pool (ใช้ร่วมกันใน endpoint ได้)
let pool;
async function connectToDatabase() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database connection failed:', err);
    setTimeout(connectToDatabase, 5000); // Retry connection every 5 seconds if failed
  }
}
connectToDatabase();

// กำหนดที่เก็บไฟล์สำหรับ multer (อัพโหลดไฟล์)
const storage = multer.diskStorage({
  destination: (req, file,  cb) => {
    cb(null, 'uploads/'); // โฟลเดอร์สำหรับเก็บไฟล์
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์เป็น timestamp + นามสกุล
  },
});
const upload = multer({ storage });

// Socket.IO สำหรับการแจ้งเตือนแบบเรียลไทม์
let onlineUsers = [];
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // เมื่อผู้ใช้เชื่อมต่อออนไลน์
  socket.on('userOnline', (userId, username) => {
    if (userId && username) {
      onlineUsers.push({ userId, username, socketId: socket.id });
      console.log(`${username} is online.`);
    }
    io.emit('onlineUsers', onlineUsers); // ส่งรายชื่อผู้ใช้ที่ออนไลน์
  });

  // เมื่อผู้ใช้ถูกตัดการเชื่อมต่อ
  socket.on('disconnect', () => {
    const userIndex = onlineUsers.findIndex((user) => user.socketId === socket.id);
    if (userIndex !== -1) {
      const username = onlineUsers[userIndex].username;
      onlineUsers.splice(userIndex, 1);
      io.emit('onlineUsers', onlineUsers);
      console.log(`${username} has disconnected.`);
    }
  });
});

// ------------------------------------ API สำหรับผู้ใช้ (Users) ------------------------------------
// 📌 API: ลงทะเบียนผู้ใช้
app.post('/api/users', async (req, res) => {
  const { username } = req.body;
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;

  if (!username) {
    return res.status(400).json({ error: 'กรุณากรอกชื่อผู้ใช้' });
  }

  try {
    let existingUser = await pool.request()
      .input('ip', sql.NVarChar, ip)
      .query('SELECT user_id, username FROM users WHERE ip = @ip');

    if (existingUser.recordset.length > 0) {
      return res.status(409).json({ error: 'คุณได้ลงทะเบียนชื่อผู้ใช้แล้วใน IP นี้' });
    }

    const insertResult = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('ip', sql.NVarChar, ip)
      .query('INSERT INTO users (username, ip) VALUES (@username, @ip); SELECT SCOPE_IDENTITY() AS user_id;');

    const userId = insertResult.recordset[0]?.user_id;

    if (!userId) {
      return res.status(500).json({ error: 'Error generating user ID' });
    }

    io.emit('updateUsername', { username });

    res.status(201).json({ user_id: userId, username, ip });

  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📌 API: ดึงข้อมูลผู้ใช้จาก IP
app.get('/api/users', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;

  try {
    const result = await pool.request()
      .input('ip', sql.NVarChar, ip)
      .query('SELECT user_id, username FROM users WHERE ip = @ip');

    if (result.recordset.length > 0) {
      return res.status(200).json(result.recordset[0]);
    }

    return res.status(404).json({ error: 'ไม่พบชื่อผู้ใช้ในระบบ' });

  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ------------------------------------ API สำหรับแชท (Chats) ------------------------------------
// 📌 API: ส่งข้อความแชท (POST)
app.post('/api/chats', async (req, res) => {
  const { user_id, username, message } = req.body;

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!user_id || !username || !message) {
    return res.status(400).json({ error: 'user_id, username และ message เป็นข้อมูลที่จำเป็น' });
  }

  // ตรวจสอบว่า user_id เป็นตัวเลข
  if (isNaN(user_id)) {
    return res.status(400).json({ error: 'user_id ต้องเป็นตัวเลข' });
  }

  try {
    // เพิ่มข้อความใหม่ในฐานข้อมูล
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('username', sql.NVarChar, username)
      .input('message', sql.NVarChar, message)
      .query('INSERT INTO chats (user_id, username, message) VALUES (@user_id, @username, @message); SELECT SCOPE_IDENTITY() AS chat_id;');
    
    const chat_id = result.recordset[0].chat_id;

    // ส่งการตอบกลับข้อความที่ถูกโพสต์
    res.status(201).json({ chat_id, username, message });

    // ส่งข้อความแชทใหม่ให้กับผู้ใช้ที่ออนไลน์ทั้งหมด
    io.emit('newChat', { user_id, username, message });

    // ส่งการแจ้งเตือนเมื่อมีข้อความแชทใหม่
    notifier.notify({
      title: 'New Chat Message',
      message: `${username}: ${message}`,
      sound: true, 
      wait: true, 
    });

  } catch (err) {
    console.error('Error inserting chat:', err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 API: ดึงข้อมูลข้อความแชท (GET)
app.get('/api/chats', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT c.chat_id, c.user_id, c.username, c.message, c.created_at FROM chats c ORDER BY c.created_at ASC');
    
    // ส่งข้อความแชททั้งหมดกลับมา
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแชท' });
  }
});


// ------------------------------------ API สำหรับประกาศ (Announcements) ------------------------------------
/*app.get('/api/announcements', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM announcements ORDER BY date DESC');
    let announcements = result.recordset;
    announcements = announcements.map((announcement) => {
      if (announcement.image) {
        announcement.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(announcement.image)}`;
      }
      return announcement;
    });
    res.json(announcements);
  } catch (err) {
    console.error('Error retrieving announcements:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประกาศ' });
  }
});

app.post('/api/announcements', upload.single('image'), async (req, res) => {
  const { title, description, department } = req.body;
  const date = new Date();
  const image = req.file ? req.file.path : null;
  try {
    await pool
      .request()
      .input('title', sql.NVarChar, title)
      .input('description', sql.NVarChar, description)
      .input('department', sql.NVarChar, department)
      .input('date', sql.DateTime, date)
      .input('image', sql.NVarChar, image)
      .query(
        'INSERT INTO announcements (title, description, department, date, image) VALUES (@title, @description, @department, @date, @image)'
      );

    // ส่งการแจ้งเตือนเมื่อมีประกาศใหม่
    notifier.notify({
      title: 'New Announcement',
      message: `New announcement: ${title}`,
      sound: true,
      wait: true,
    });

    io.emit('newAnnouncement', { title, description, department, date, image });
    res.status(201).json({ message: 'ประกาศถูกเพิ่มเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Error inserting announcement:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มประกาศ' });
  }
});*/

// ------------------------------------ API สำหรับสาระน่ารู้ (Info) ------------------------------------

app.get('/api/info', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM info ORDER BY date DESC');
    let info = result.recordset.map((item) => {
      if (item.file) {
        item.fileUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(item.file)}`;
      }
      return item;
    });
    res.json(info);
  } catch (err) {
    console.error('Error retrieving info:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลสาระน่ารู้' });
  }
});

app.post('/api/info', upload.single('file'), async (req, res) => {
  const { title, content, department } = req.body; // รับค่าจาก body
  const date = new Date();
  const file = req.file ? req.file.path : null;

  // ตรวจสอบว่าค่าของ department, title, content ถูกส่งมาหรือไม่
  if (!title || !content || !department) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // ปรับการ query เพื่อให้รองรับการเพิ่ม department
    const result = await pool.request()
      .input('title', sql.NVarChar, title)
      .input('content', sql.NVarChar, content)
      .input('date', sql.DateTime, date)
      .input('file', sql.NVarChar, file)
      .input('department', sql.NVarChar, department)  // เพิ่ม department
      .query('INSERT INTO info (title, content, date, [file], department) VALUES (@title, @content, @date, @file, @department)');
    
    console.log('New Info Added:', { title, content, file, department });

    // ส่งการแจ้งเตือนเมื่อข้อมูลใหม่ถูกเพิ่ม
    notifier.notify({
      title: 'New Info',
      message: `New info: ${title}`,
      sound: true,
      wait: true,
    });

    const newInfo = { 
      title, 
      content, 
      fileUrl: file ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(file)}` : null, 
      department 
    };
    
    io.emit('newInfo', newInfo); // ส่งข้อมูลใหม่ให้กับ frontend ผ่าน WebSocket

    res.status(201).json({ message: 'สาระน่ารู้ถูกเพิ่มเรียบร้อยแล้ว', newInfo });
  } catch (err) {
    console.error('Error inserting info:', err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มสาระน่ารู้' });
  }
});

// 📌 API: ลบข้อมูลสาระน่ารู้
app.delete('/api/info/:id', async (req, res) => {
  const { id } = req.params;

  // ตรวจสอบว่า info เป็นตัวเลขหรือไม่
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'id ไม่ถูกต้อง' });
  }

  try {
    // ตรวจสอบว่าข้อมูลสาระน่ารู้มีอยู่ในระบบหรือไม่
    const checkInfo = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM info WHERE id = @id');

    if (checkInfo.recordset.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลสาระน่ารู้ที่ต้องการลบ' });
    }

    // ลบข้อมูลสาระน่ารู้จากฐานข้อมูล
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM info WHERE id = @id');

    // ส่งผลลัพธ์กลับไปยัง Frontend
    res.status(200).json({ message: 'ลบข้อมูลสาระน่ารู้เรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Error deleting info:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูลสาระน่ารู้' });
  }
});


// ------------------------------------ API สำหรับกิจกรรม (Events) ------------------------------------


app.post('/api/event', async (req, res) => {
  const { Title, EventDate, EventType } = req.body;

  if (!Title || !EventDate || !EventType) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }

  try {
    const result = await pool.request()
      .input('Title', sql.NVarChar, Title)
      .input('EventDate', sql.Date, EventDate)
      .input('EventType', sql.NVarChar, EventType)
      .query('INSERT INTO event (Title, EventDate, EventType) VALUES (@Title, @EventDate, @EventType)');

    res.status(201).json({ message: 'กิจกรรมถูกเพิ่มสำเร็จ' });
  } catch (err) {
    console.error('Error inserting event:', err);
    res.status(500).json({ error: `เกิดข้อผิดพลาดในการเพิ่มกิจกรรม: ${err.message}` });
  }
});

// API สำหรับดึงข้อมูลกิจกรรมทั้งหมด
app.get('/api/event', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM event ORDER BY EventDate DESC');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error retrieving events:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลกิจกรรมได้' });
  }
});

// 📌 API: ลบข้อมูลกิจกรรม
app.delete('/api/event/:EventID', async (req, res) => {
  const { EventID } = req.params;

  // ตรวจสอบว่า EventID เป็นตัวเลขหรือไม่
  if (!EventID || isNaN(EventID)) {
    return res.status(400).json({ error: 'ID ไม่ถูกต้อง' });
  }

  try {
    // ตรวจสอบว่าข้อมูลกิจกรรมมีอยู่ในระบบหรือไม่
    const checkEvent = await pool.request()
      .input('EventID', sql.Int, EventID)
      .query('SELECT * FROM event WHERE EventID = @EventID');

    if (checkEvent.recordset.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลกิจกรรมที่ต้องการลบ' });
    }

    // ลบข้อมูลกิจกรรมจากฐานข้อมูล
    await pool.request()
      .input('EventID', sql.Int, EventID)
      .query('DELETE FROM event WHERE EventID = @EventID');

    // ส่งผลลัพธ์กลับไปยัง Frontend
    res.status(200).json({ message: 'ลบข้อมูลกิจกรรมเรียบร้อยแล้ว' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูลกิจกรรม' });
  }
});





// ------------------------------------ API สำหรับข่าวสาร (News) ------------------------------------
// เพิ่มข่าว พร้อมรองรับอัปโหลดรูปภาพ
app.post('/api/News', upload.single('ImagePath'), async (req, res) => {
  const { Title, Description, Date } = req.body;
  const ImagePath = req.file ? req.file.path.replace(/\\/g, '/') : null; // แปลงพาธเป็นรูปแบบที่ถูกต้อง

  if (!Title || !Description || !Date) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const result = await pool.request()
      .input('Title', sql.NVarChar, Title)
      .input('Description', sql.NVarChar, Description)
      .input('Date', sql.Date, Date)
      .input('ImagePath', sql.NVarChar, ImagePath)
      .query('INSERT INTO News (Title, Description, Date, ImagePath) VALUES (@Title, @Description, @Date, @ImagePath)');

    res.status(201).json({ message: 'ข่าวถูกเพิ่มสำเร็จ', imageUrl: ImagePath });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มข่าว' });
  }
});

// แก้ไข API ดึงข่าวให้ส่ง URL ของรูปภาพที่ถูกต้อง
app.get('/api/News', async (req, res) => {
  try {
    const result = await pool.request().query('SELECT * FROM News');

    const newsList = result.recordset.map(news => ({
      ...news,
      image: news.ImagePath ? `${req.protocol}://${req.get('host')}/image/${news.ImagePath}` : null // ตั้งชื่อเป็น 'image' เพื่อให้ตรงกับใน React
    }));

    res.status(200).json(newsList);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลข่าวได้' });
  }
});

// 📌 API: ลบข่าว
app.delete('/api/News/:Id', async (req, res) => {
  const { Id } = req.params;

  // ตรวจสอบว่า Id เป็นตัวเลขหรือไม่
  if (!Id || isNaN(Id)) {
    return res.status(400).json({ error: 'Id ไม่ถูกต้อง' });
  }

  try {
    // ตรวจสอบว่าข่าวมีอยู่ในระบบหรือไม่
    const checkNews = await pool.request()
      .input('Id', sql.Int, Id)
      .query('SELECT * FROM News WHERE Id = @Id');

    if (checkNews.recordset.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข่าวที่ต้องการลบ' });
    }

    // ลบข่าว
    await pool.request()
      .input('Id', sql.Int, Id)
      .query('DELETE FROM News WHERE Id = @Id');

    // ส่งผลลัพธ์กลับไปยัง Frontend
    res.status(200).json({ message: 'ลบข่าวสำเร็จ' });
  } catch (err) {
    console.error('Error deleting news:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข่าว' });
  }
});




// เริ่มต้นการทำงานของเซิร์ฟเวอร์
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


