import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ControlAdmin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null); // สิทธิ์ของผู้ใช้งาน: 'admin' หรือ 'superadmin'
  const [error, setError] = useState(''); // ข้อความแจ้งเตือนกรณีกรอกรหัสผ่านผิด

  // ฟังก์ชันสำหรับการนำทางไปยังหน้าแต่ละหน้าของฟังก์ชันจัดการ
  const handleNavigate = (path) => {
    navigate(path);
  };

  // ฟังก์ชันตรวจสอบรหัสผ่านและกำหนดสิทธิ์
  const handleLogin = () => {
    if (password === 'admin05') {
      setRole('admin');
      setError('');
    } else if (password === 'superadmin05') {
      setRole('superadmin');
      setError('');
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  // หากยังไม่ได้ล็อกอิน ให้แสดงฟอร์มกรอกรหัสผ่าน
  if (!role) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #102C57, #bbdefb)',
        }}
      >
        <Typography variant="h4" sx={{ color: '#F8F0E5', fontWeight: 600, marginBottom: '20px' }}>
          Admin Login
        </Typography>
        <TextField
          label="Enter Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '20px', width: '300px' }}
        />
        <Button variant="contained" onClick={handleLogin} sx={{ width: '300px' }}>
          Login
        </Button>
        {error && <Alert severity="error" sx={{ marginTop: '20px' }}>{error}</Alert>}
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px 0', background: 'linear-gradient(to bottom, #102C57, #bbdefb)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#F8F0E5', fontWeight: 600, textAlign: 'center', marginBottom: '40px' }}>
        Admin
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* ฟังก์ชันการจัดการประกาศ */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.03)' },
              cursor: 'pointer',
              padding: '8px',
              maxWidth: '200px',
              margin: '0 auto',
            }}
            onClick={() => handleNavigate('/News')}
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                News
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ฟังก์ชันการจัดการสาระน่ารู้ */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.03)' },
              cursor: 'pointer',
              padding: '8px',
              maxWidth: '200px',
              margin: '0 auto',
            }}
            onClick={() => handleNavigate('/InfoManagement')}
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                Learning Point
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ฟังก์ชันการดูประวัติการแชท (เฉพาะ superadmin) */}
        {role === 'superadmin' && (
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.03)' },
                cursor: 'pointer',
                padding: '8px',
                maxWidth: '200px',
                margin: '0 auto',
              }}
              onClick={() => handleNavigate('/ChatHistory')}
            >
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                  History Chat
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* ฟังก์ชันการเพิ่มกิจกรรม */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.03)' },
              cursor: 'pointer',
              padding: '8px',
              maxWidth: '200px',
              margin: '0 auto',
            }}
            onClick={() => handleNavigate('/Event')}
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
                Events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ControlAdmin;