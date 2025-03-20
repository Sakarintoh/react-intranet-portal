import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Home from "./pages/Home";
import Info from "./pages/Info";
import ContactAdmin from "./pages/ContactAdmin";
import Chat from "./pages/Chat";
import ControlAdmin from "./pages/ControlAdmin";
import News from './components/News'; 
import InfoManagement from './components/InfoManagement';
import ChatHistory from './components/ChatHistory';  
import Directory from './components/Directory';  
import Event from './components/Event';
import "./styles.css";

const pages = [
  { title: "Home", link: "/" },
  { title: "Learning Point", link: "/info" },
  { title: "Live Chat", link: "/chat" },
  { title: "IT Contact", link: "/contactadmin" },
  { title: "Admin", link: "/controladmin" },
];

function App() {
  return (
    <Router>
      <AppBar position="sticky" sx={{ background: "#102C57" }}>
        <Toolbar>
          {/* โลโก้ */}
          <img src="/icon.png" alt="logo" style={{ width: "50px", height: "50px", padding: "10px" }} />
          
          {/* ชื่อบริษัท */}
          <Typography variant="h6" sx={{ color: "white", flexGrow: 1 }}>
            MITSUI-SOKO THAILAND GROUP
          </Typography>

          {/* ปุ่มเมนู */}
          <Box sx={{ display: "flex" }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                component={Link}
                to={page.link}
                sx={{
                  margin: "0 15px",
                  color: "#F8F0E5", // สีข้อความเริ่มต้น
                  backgroundColor: "#102C57",
                  padding: "10px 15px", // ปรับขนาดปุ่มให้ใหญ่ขึ้น
                  fontSize: "16px", // ข้อความขนาดใหญ่ขึ้น
                  borderRadius: "25px", // ให้ปุ่มมีมุมโค้งมน
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // เพิ่มเงาปุ่ม
                  position: "relative",
                  "&:hover": {
                    backgroundColor: "#F8F0E5", // สีเมื่อ hover
                    color: "#102C57", // เปลี่ยนสีข้อความเมื่อ hover
                  },
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#F8F0E5", // สีของแถบ
                    transform: "scaleX(0)",
                    transition: "transform 0.3s ease",
                  },
                  "&:hover::after": {
                    transform: "scaleX(1)", // ทำให้แถบขยายเมื่อ hover
                  },
                }}
              >
                <Typography variant="h6">{page.title}</Typography>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: "#F4F6F8", minHeight: "100vh", padding: "20px" }}>
        <Container maxWidth="lg">
          {/* Routes */}
          <Routes>
            {/* Route สำหรับ Home */}
            <Route path="/" element={<Home />} />

            {/* เส้นทางอื่นๆ */}
            <Route path="/info" element={<Info />} />
            <Route path="/contactadmin" element={<ContactAdmin />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/controladmin" element={<ControlAdmin />} />
            <Route path="/news" element={<News />} />
            <Route path="/infomanagement" element={<InfoManagement />} />
            <Route path="/event" element={<Event />} />
            <Route path="/chathistory" element={<ChatHistory />} />
            <Route path="/directory" element={<Directory />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
