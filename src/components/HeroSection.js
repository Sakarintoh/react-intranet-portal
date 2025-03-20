import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { Contacts } from "@mui/icons-material"; // นำเข้าไอคอน Contacts
import { useNavigate } from "react-router-dom"; // ใช้สำหรับการเปลี่ยนเส้นทาง

const HeroSection = () => {
  const navigate = useNavigate(); // ฟังก์ชัน navigate สำหรับเปลี่ยนเส้นทาง

  // ฟังก์ชัน handleNavigate สำหรับปุ่ม Directory
  const handleNavigateDirectory = () => {
    navigate("/Directory"); // กำหนดให้ปุ่ม Directory นำไปที่ '/directory'
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px 80px", // เพิ่ม padding ให้มากขึ้นเพื่อความหรูหรา
        backgroundColor: "transparent", // ใช้ transparent เพื่อให้ไม่ซ้อนกับ linear-gradient
        background:
          "linear-gradient(to bottom, #F8F0E5 15%, #EADBC8 45%, #DAC0A3 75%, #102C57 150%)", // ปรับจุดตัดให้ไล่เรียง
        color: "#102C57",
        borderRadius: "8px",
      }}
    >
      {/* จัดเรียงข้อความและรูปภาพใน Grid เพื่อให้มีระยะห่างที่เหมาะสม */}
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {/* ข้อความทางซ้าย */}
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: "10px" }}>
              Welcome to Information
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: "20px", marginLeft: "260px" }}>
              MSTG (INTRANET)
            </Typography>
          </Box>
        </Grid>

        {/* รูปภาพทางขวา */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <img
              src="/Mit.jpg"
              alt="logo"
              style={{
                maxWidth: "60%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // เพิ่มเงาให้ดูหรูหรา
                transition: "filter 0.3s ease", // เพิ่มการเปลี่ยนแปลงของ filter
              }}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        {/* ปุ่มแรก */}
        <Button
          variant="contained"
          sx={{
            marginRight: "20px", // ระยะห่างระหว่างปุ่ม
            backgroundColor: "#F8F0E5",
            display: "inline-flex", // ให้ปุ่มแสดงเป็นแถว
            alignItems: "center", // ให้ไอคอนกับข้อความอยู่กลาง
            padding: "12px 30px", // ปรับขนาดปุ่มให้ใหญ่ขึ้น
            fontSize: "16px", // ข้อความขนาดใหญ่ขึ้น
            borderRadius: "25px", // ให้ปุ่มมีมุมโค้งมน
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // เพิ่มเงาปุ่ม
            position: "relative", // ใช้เพื่อให้แถบปรากฏ
            color: "#102C57", // กำหนดสีของตัวหนังสือเริ่มต้น
            "&:hover": {
              backgroundColor: "#102C57", // สีเมื่อ hover
              color: "#F8F0E5", // เปลี่ยนสีข้อความเมื่อ hover
            },
            "&:hover img": {
              filter: "brightness(0) invert(1)", // เปลี่ยนสีรูปภาพเป็นขาวเมื่อ hover
            },
            "&:after": {
              content: '""', // เพิ่มแถบเส้นใต้
              position: "absolute",
              bottom: "0", // ให้แถบอยู่ที่ด้านล่างของปุ่ม
              left: "0",
              width: "100%",
              height: "2px", // ความสูงของแถบ
              backgroundColor: "#F8F0E5", // สีของแถบ
              transform: "scaleX(0)", // สร้างแถบให้ไม่แสดงในเริ่มต้น
              transition: "transform 0.3s ease", // ทำให้แถบแสดงอย่างนุ่มนวลเมื่อ hover
            },
            "&:hover::after": {
              transform: "scaleX(1)", // ทำให้แถบขยายเมื่อ hover
            },
          }}
          startIcon={
            <img src="/INTRANET.png" alt="logo" style={{ width: "30px", height: "30px" }} />
          }
          onClick={() => window.open("http://192.168.5.18/XIQMA", "_blank")}
        >
          XIQMA
        </Button>

        {/* ปุ่มที่สอง (Directory) */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#F8F0E5",
            display: "inline-flex", // ให้ปุ่มแสดงเป็นแถว
            alignItems: "center", // ให้ไอคอนกับข้อความอยู่กลาง
            padding: "12px 30px", // ปรับขนาดปุ่มให้ใหญ่ขึ้น
            fontSize: "16px", // ข้อความขนาดใหญ่ขึ้น
            borderRadius: "25px", // ให้ปุ่มมีมุมโค้งมน
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // เพิ่มเงาปุ่ม
            position: "relative", // ใช้เพื่อให้แถบปรากฏ
            color: "#102C57", // กำหนดสีของตัวหนังสือเริ่มต้น
            "&:hover": {
              backgroundColor: "#102C57", // สีเมื่อ hover
              color: "#F8F0E5", // เปลี่ยนสีข้อความเมื่อ hover
            },
            "&:hover svg": {
              color: "#FFFFFF", // เปลี่ยนสีของไอคอนเมื่อ hover
            },
            "&:after": {
              content: '""', // เพิ่มแถบเส้นใต้
              position: "absolute",
              bottom: "0", // ให้แถบอยู่ที่ด้านล่างของปุ่ม
              left: "0",
              width: "100%",
              height: "2px", // ความสูงของแถบ
              backgroundColor: "#F8F0E5", // สีของแถบ
              transform: "scaleX(0)", // สร้างแถบให้ไม่แสดงในเริ่มต้น
              transition: "transform 0.3s ease", // ทำให้แถบแสดงอย่างนุ่มนวลเมื่อ hover
            },
            "&:hover::after": {
              transform: "scaleX(1)", // ทำให้แถบขยายเมื่อ hover
            },
          }}
          startIcon={<Contacts sx={{ width: "30px", height: "30px", color: "#102C57" }} />}
          onClick={handleNavigateDirectory} // เมื่อคลิกจะนำไปหน้า '/directory'
        >
          Directory
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
