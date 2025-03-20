import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://192.168.5.12:5000");

const EventManagement = () => {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [events, setEvents] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://192.168.5.12:5000/api/event");
        setEvents(response.data);
      } catch (error) {
        setSnackbarMessage("เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };
    fetchEvents();

    socket.on("newEvent", (newEvent) => {
      setEvents((prevEvents) => [newEvent, ...prevEvents]);
    });

    return () => {
      socket.off("newEvent");
    };
  }, []);

  const handleSaveEvent = async () => {
    if (!title || !eventDate || !eventType) {
      setSnackbarMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://192.168.5.12:5000/api/event", {
        Title: title,
        EventDate: eventDate,
        EventType: eventType,
      });

      setSnackbarMessage("เพิ่มกิจกรรมเรียบร้อยแล้ว!");
      setSnackbarSeverity("success");
      setTitle("");
      setEventDate("");
      setEventType("");
    } catch (error) {
      setSnackbarMessage("ไม่สามารถบันทึกกิจกรรมได้");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

 // 📌 ฟังก์ชันลบกิจกรรมใน Frontend
const handleDeleteEvent = async (EventID) => {
  try {
    const response = await fetch(`http://192.168.5.12:5000/api/event/${EventID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.EventID !== EventID));
      setSnackbarMessage("ลบกิจกรรมสำเร็จ");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } else {
      const data = await response.json();
      setSnackbarMessage(data.error || "เกิดข้อผิดพลาดในการลบกิจกรรม");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    setSnackbarMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์");
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
  }
};

  return (
    <Box sx={{ padding: "40px", background: "linear-gradient(to bottom, #F8F0E5 15%, #EADBC8 45%, #DAC0A3 75%, #102C57 150%)", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ fontWeight: 600, textAlign: "center", marginBottom: "40px" }}>
        การจัดการกิจกรรม
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="หัวข้อกิจกรรม"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="วันที่"
            fullWidth
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel>ประเภทกิจกรรม</InputLabel>
            <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
              <MenuItem value="Conference">Conference</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Seminar">Seminar</MenuItem>
              <MenuItem value="Meeting">Meeting</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSaveEvent}
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึกกิจกรรม"}
          </Button>
        </Grid>
      </Grid>

      {/* กล่องแสดงรายการกิจกรรม */}
      <Typography variant="h6" sx={{ fontWeight: 600, marginTop: "40px" }}>
        รายการกิจกรรม
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
          {events.map((event, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <ListItemText primary={event.Title} secondary={`${event.EventDate} (${event.EventType})`} />
              <IconButton onClick={() => handleDeleteEvent(event.EventID)}>
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

export default EventManagement;
