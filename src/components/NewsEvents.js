import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Chip, Grid, Card, CardContent, CardMedia } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "./calendarStyles.css";

// CalendarWidget Component
const CalendarWidget = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // ดึงข้อมูลกิจกรรมจาก API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://192.168.5.12:5000/api/event"); // ใช้ URL API ของคุณ
        setEvents(response.data); // เก็บข้อมูลกิจกรรมจาก API
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const tileClassName = ({ date, view }) => {
    const eventDates = events.map((event) => new Date(event.EventDate).toLocaleDateString());
    if (eventDates.includes(date.toLocaleDateString())) {
      return "highlight"; // Custom class for highlighted dates
    }
  };

  // กรองกิจกรรมที่ยังไม่ผ่านไป
  const upcomingEvents = events
    .filter((event) => new Date(event.EventDate) >= currentDate) // กรองเฉพาะกิจกรรมที่ยังไม่เกิดขึ้น
    .sort((a, b) => new Date(a.EventDate) - new Date(b.EventDate)); // เรียงลำดับจากวันที่ใกล้ที่สุด

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Box sx={{ maxWidth: "300px", margin: "0px", backgroundColor: "#f9f9f9", borderRadius: "12px" }}>
      {/* Paper for Calendar */}
      <Paper sx={{ maxHeight: "320px", padding: "10px", marginBottom: "20px", backgroundColor: "#fff", borderRadius: "12px" }}>
        <Calendar
          onChange={setCurrentDate}
          value={currentDate}
          tileClassName={tileClassName}
          view="month"
          showNavigation={true} // Enable the navigation buttons
          next2Label={null} // Remove next month's button
          prev2Label={null} // Remove previous month's button
        />
      </Paper>

      {/* Paper for Events List */}
      <Paper sx={{ padding: "10px", backgroundColor: "#fff", borderRadius: "12px" }}>
        <Box sx={{ mt: 2, maxHeight: "250px", overflowY: "auto", overflowX: "hidden" }}>
          {upcomingEvents.map((event, index) => (
            <Paper
              key={index}
              sx={{
                p: 1.5,
                mt: 1,
                display: "flex",
                alignItems: "flex-start",
                borderRadius: "8px",
                backgroundColor: "#fff",
                flexDirection: "column",
                width: "90%",
              }}
            >
              {/* แสดงวันที่และเดือน */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#102C57",
                    backgroundColor: "#f5f5f5",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontSize: "1rem",
                    marginRight: "10px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {formatDate(event.EventDate)}
                </Typography>

                <Chip
                  label={
                    <Typography variant="body2" sx={{ display: "flex", fontWeight: "bold" }}>
                      {event.EventType.split(" ").map((type, index) => {
                        let color;
                        // กำหนดสีพื้นหลังสำหรับแต่ละประเภท
                        switch (type.toLowerCase()) {
                          case "business":
                            color = "#102C57";
                            break;
                          case "dayoff":
                            color = "#F8F0E5";
                            break;
                          case "workshop":
                            color = "#FF9800";
                            break;
                          case "meeting":
                            color = "#3F51B5";
                            break;
                          case "conference":
                            color = "#4CAF50";
                            break;
                          case "seminar":
                            color = "#E91E63";
                            break;
                          default:
                            color = "#102C57"; // สีเริ่มต้น
                        }

                        return (
                          <span key={index} style={{ color: color, fontWeight: "bold", marginRight: "5px" }}>
                            {type}
                          </span>
                        );
                      })}
                    </Typography>
                  }
                  size="small"
                  sx={{
                    backgroundColor: event.EventType.toLowerCase().includes("business") ? "#102C57" : "#F8F0E5",
                    color: "#fff",
                    borderRadius: "16px",
                  }}
                />
              </Box>

              {/* หัวข้อกิจกรรม */}
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#333",
                  fontSize: "0.8rem",
                  backgroundColor: "#e0e0e0",
                  padding: "8px",
                  borderRadius: "4px",
                  marginTop: "8px",
                  width: "95%",
                  wordBreak: "break-word",
                }}
              >
                {event.Title}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

// NewsEvents Component
const NewsEvents = () => {
  const [newsData, setNewsData] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://192.168.5.12:5000/api/News"); // API URL
        const sortedNews = response.data.sort((a, b) => {
          return new Date(b.Date) - new Date(a.Date); // Sort by Date
        });
        setNewsData(sortedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Box sx={{ padding: "30px", backgroundColor: "#FFF", borderRadius: "8px", maxWidth: "735px", flex: 1, overflow: "auto", maxHeight: "500px" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "2.2rem", color: "#F8F0E5", backgroundColor: "#102C57", padding: "8px 16px", borderRadius: "8px" }}>
        News & Events
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: "10px" }}>
        {newsData.length === 0 ? (
          <Typography variant="body1" sx={{ color: "#333", fontSize: "1.2rem", marginTop: "20px" }}>
            No news available.
          </Typography>
        ) : (
          newsData.map((news, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: "flex" }}>
                <CardMedia component="img" sx={{ width: 200, height: 200 }} image={`http://192.168.5.12:5000/${news.ImagePath}`} />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {news.Title}
                  </Typography>
                  <Typography variant="body2">{news.Description}</Typography>
                  <Typography variant="caption">{formatDate(news.Date)}</Typography> {/* Format Date */}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

// Dashboard Component
const Dashboard = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "10px", width: "100%", height: "100%" }}>
      <NewsEvents /> {/* แสดงข่าว */}
      <CalendarWidget /> {/* แสดงปฏิทินกิจกรรม */}
    </Box>
  );
};

export default Dashboard;
