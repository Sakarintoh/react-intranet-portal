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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"; // เพิ่ม Select, MenuItem, FormControl, InputLabel
import DeleteIcon from "@mui/icons-material/Delete";
import io from "socket.io-client";

const socket = io("http://192.168.5.12:5000");

const InfoManagement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState(""); // ใช้ state เดิมสำหรับแผนก
  const [file, setFile] = useState(null);
  const [infos, setInfos] = useState([]);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch initial data and listen for real-time updates
  useEffect(() => {
    const fetchInfos = async () => {
      try {
        const response = await fetch("http://192.168.5.12:5000/api/info");
        const data = await response.json();
        if (response.ok) {
          setInfos(data);
        } else {
          setSnackbarState({
            open: true,
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลสาระน่ารู้",
            severity: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching infos:", error);
        setSnackbarState({
          open: true,
          message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
          severity: "error",
        });
      }
    };
    fetchInfos();

    socket.on("newInfo", (newInfo) => {
      setInfos((prevInfos) => [newInfo, ...prevInfos]);
    });

    return () => {
      socket.off("newInfo");
    };
  }, []);

  // Add new info
  const handleAddInfo = async () => {
    if (!title || !content || !department) {
      setSnackbarState({
        open: true,
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        severity: "warning",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("department", department);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://192.168.5.12:5000/api/info", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSnackbarState({
          open: true,
          message: "เพิ่มสาระน่ารู้สำเร็จ!",
          severity: "success",
        });
        setTitle("");
        setContent("");
        setDepartment(""); // ล้างค่าแผนกที่เลือก
        setFile(null);
      } else {
        setSnackbarState({
          open: true,
          message: data.message || "เกิดข้อผิดพลาดในการเพิ่มสาระน่ารู้",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding info:", error);
      setSnackbarState({
        open: true,
        message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        severity: "error",
      });
    }
  };

  // Delete info
  const handleDeleteInfo = async (id) => {
    try {
      const response = await fetch(`http://192.168.5.12:5000/api/info/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInfos((prevInfos) => prevInfos.filter((info) => info.id !== id));
        setSnackbarState({
          open: true,
          message: "ลบสาระน่ารู้สำเร็จ",
          severity: "success",
        });
      } else {
        const data = await response.json();
        setSnackbarState({
          open: true,
          message: data.message || "เกิดข้อผิดพลาดในการลบสาระน่ารู้",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting info:", error);
      setSnackbarState({
        open: true,
        message: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
        severity: "error",
      });
    }
  };

  // Handle file input change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <Box sx={{ padding: "40px", minHeight: "100vh", background: "linear-gradient(to bottom, #F8F0E5, #DAC0A3)" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center", marginBottom: "40px" }}>
        การจัดการสาระน่ารู้
      </Typography>

      {/* Form Section */}
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="หัวข้อสาระน่ารู้"
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />

          {/* Dropdown for Department */}
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>แผนก</InputLabel>
            <Select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              label="แผนก"
            >
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="GA">GA</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
            </Select>
          </FormControl>

          <input type="file" accept="image/*, application/pdf" onChange={handleFileChange} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddInfo}
            sx={{ marginTop: "20px" }}
          >
            เพิ่มสาระน่ารู้
          </Button>
        </Grid>
      </Grid>

      {/* Info List Section */}
      <Typography variant="h6" sx={{ fontWeight: 600, marginTop: "40px" }}>
        รายการสาระน่ารู้
      </Typography>
      <Box
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "16px",
          marginTop: "20px",
          background: "#fff",
        }}
      >
        <List>
          {infos.map((info, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <ListItemText primary={info.title} secondary={`${info.content} - แผนก: ${info.department}`} />
              {info.fileUrl && (
                <a href={info.fileUrl} target="_blank" rel="noopener noreferrer">
                  ดาวน์โหลดไฟล์
                </a>
              )}
              <IconButton onClick={() => handleDeleteInfo(info.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbarState.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarState.severity} sx={{ width: "100%" }}>
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InfoManagement;