import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import io from "socket.io-client";

const socket = io("http://192.168.5.12:5000");

const AddNews = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://192.168.5.12:5000/api/News");
        const data = await response.json();
        if (response.ok) {
          setNewsList(data);
        } else {
          setSnackbarMessage("เกิดข้อผิดพลาดในการดึงข่าว");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setSnackbarMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchNews();

    socket.on("newNews", (newNews) => {
      setNewsList((prevNews) => [newNews, ...prevNews]);
    });

    return () => {
      socket.off("newNews");
    };
  }, []);

  const handleAddNews = async () => {
    if (!title || !description || !date) {
      setSnackbarMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("Date", date);
    if (image) {
      formData.append("ImagePath", image);
    }

    try {
      const response = await fetch("http://192.168.5.12:5000/api/News", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbarMessage("เพิ่มข่าวสำเร็จ!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTitle("");
        setDescription("");
        setDate("");
        setImage(null);
      } else {
        setSnackbarMessage(data.message || "เกิดข้อผิดพลาดในการเพิ่มข่าว");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error adding news:", error);
      setSnackbarMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDeleteNews = async (Id) => {
    try {
      const response = await fetch(`http://192.168.5.12:5000/api/News/${Id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        setNewsList((prevNews) => prevNews.filter((news) => news.Id !== Id));
        setSnackbarMessage("ลบข่าวสำเร็จ");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } else {
        const data = await response.json();
        setSnackbarMessage(data.error || "เกิดข้อผิดพลาดในการลบข่าว");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      setSnackbarMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  

  return (
    <Box sx={{ padding: "40px", minHeight: "100vh", background: "linear-gradient(to bottom, #F8F0E5, #DAC0A3)" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center", marginBottom: "40px" }}>
        การจัดการข่าวสาร
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="หัวข้อข่าว"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="รายละเอียด"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="วันที่"
            variant="outlined"
            fullWidth
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: "20px" }}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddNews}
            sx={{ marginTop: "20px" }}
          >
            เพิ่มข่าวสาร
          </Button>
        </Grid>
      </Grid>

      {/* กล่องแสดงรายการข่าวสาร */}
      <Typography variant="h6" sx={{ fontWeight: 600, marginTop: "40px" }}>
        รายการข่าวสาร
      </Typography>
      <Box
        sx={{
          maxHeight: "400px", // กำหนดความสูงสุด
          overflowY: "auto", // เพิ่มแถบเลื่อนแนวตั้ง
          border: "1px solid #ccc", // เส้นขอบเพื่อความชัดเจน
          borderRadius: "8px", // มุมมน
          padding: "16px", // ระยะห่างภายในกล่อง
          marginTop: "20px", // ระยะห่างจากข้อความด้านบน
          background: "#fff", // พื้นหลังสีขาว
        }}
      >
        <List>
          {newsList.map((news, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <ListItemText primary={news.Title} secondary={news.Description} />
              <IconButton onClick={() => handleDeleteNews(news.Id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Snackbar สำหรับแจ้งเตือน */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddNews;