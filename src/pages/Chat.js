import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardContent, TextField, Button, List, ListItem, ListItemText, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const chatContainerRef = useRef(null);

  // 📌 Fetch all messages (Group chat only) - แบบไม่กรองตาม userId
  const fetchMessages = useCallback(async () => { 
    try {
      const response = await axios.get('http://192.168.5.12:5000/api/chats');
      console.log('Messages from API:', response.data); // เพิ่มการตรวจสอบว่าได้รับข้อมูลหรือไม่
      if (response.status === 200 && Array.isArray(response.data)) {
        setMessages(response.data); // ใช้ข้อมูลที่ได้จาก API
      } else {
        console.error("ไม่มีข้อมูลแชท");
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  // 📌 Fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://192.168.5.12:5000/api/users');
      if (response.status === 200 && response.data) {
        setUsername(response.data.username);
        setUserId(response.data.user_id);
      } else {
        setOpenDialog(true);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response && error.response.status === 404) {
        setOpenDialog(true);
      } else {
        alert('เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้');
      }
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && username && userId) {
      try {
        const messageData = {
          user_id: userId,
          username: username,
          message: newMessage,
        };

        await axios.post('http://192.168.5.12:5000/api/chats', messageData);
        setNewMessage(''); // Clear the input after sending
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      alert("กรุณากรอกข้อความ");
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveUsername = async () => {
    if (username.trim()) {
      try {
        const response = await axios.post('http://192.168.5.12:5000/api/users', { username });
        if (response.status === 201 && response.data?.user_id) {
          setUserId(response.data.user_id);
          setUsername(response.data.username);
          setOpenDialog(false);
        } else {
          alert("เกิดข้อผิดพลาด: ไม่สามารถสร้างชื่อผู้ใช้ได้");
        }
      } catch (error) {
        console.error('Error saving username:', error);
        if (error.response && error.response.status === 409) {
          alert("ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว");
        } else {
          alert("เกิดข้อผิดพลาดในการบันทึกชื่อ");
        }
      }
    } else {
      alert("กรุณากรอกชื่อผู้ใช้");
    }
  };

  useEffect(() => {
    fetchUser();

    const interval = setInterval(fetchMessages, 500); // Fetch messages every 500ms

    return () => {
      clearInterval(interval);
    };
  }, [fetchMessages, userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ padding: '40px 0', background: 'linear-gradient(to bottom, #102C57, #bbdefb)', minHeight: '100vh', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ color:'#F8F0E5', fontWeight: 600, textAlign: 'center', marginBottom: '40px' }}>
        Chat
      </Typography>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>กรุณากรอกชื่อของคุณ</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ชื่อผู้ใช้"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveUsername} color="primary">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12} sm={8} md={6}>
        <Card sx={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto', minHeight: '300px', position: 'relative' }}>
          <CardContent sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '400px', paddingBottom: '10px' }} ref={chatContainerRef}>
            <List id="messages-container">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <ListItem key={index} sx={{ display: 'flex', justifyContent: message.user_id === userId ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                    <Paper
                      sx={{
                        padding: '10px 15px',
                        borderRadius: '20px',
                        background: message.user_id === userId ? '#F8F0E5' : '#81d4fa',
                        maxWidth: '70%',
                        boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
                        wordWrap: 'break-word',
                      }}
                    >
                      <ListItemText
                        primary={message.message}
                        secondary={<Typography variant="body2" color="text.secondary">จาก: {message.username}</Typography>}
                      />
                    </Paper>
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">ไม่มีข้อความ</Typography>
              )}
            </List>
          </CardContent>

          <Box sx={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ccc' }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="พิมพ์ข้อความ..."
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ marginLeft: '10px' }}>
              <SendIcon />
            </Button>
          </Box>
        </Card>
      </Grid>
    </Box>
  );
};

export default Chat;
