import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const Directory = () => {
  // ฟังก์ชันสำหรับการเปิดไฟล์ PDF ในหน้าต่างใหม่
  const handleOpenPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank'); // เปิดไฟล์ PDF ในแท็บใหม่
  };

  return (
    <Box sx={{ padding: '20px 0', background: 'linear-gradient(to bottom, #102C57, #bbdefb)', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: '#F8F0E5', fontWeight: 600, textAlign: 'center', marginBottom: '40px' }}>
        Directory
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* ปุ่ม */}
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
            onClick={() => handleOpenPDF('kormadit.pdf')} // เปลี่ยน URL เป็นไฟล์ PDF จริง
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
              MITSUI-SOKO THAILAND GROUP
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ปุ่ม */}
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
            onClick={() => handleOpenPDF('lam.pdf')} // เปลี่ยน URL เป็นไฟล์ PDF จริง
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
              Laemchabang Office
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ปุ่ม  */}
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
            onClick={() => handleOpenPDF('wh19.pdf')} // เปลี่ยน URL เป็นไฟล์ PDF จริง
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
              Mitsui-Soko Logistics Km.19
              </Typography>
            </CardContent>
          </Card>
        </Grid>

         {/* ปุ่ม  */}
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
            onClick={() => handleOpenPDF('wh30.pdf')} // เปลี่ยน URL เป็นไฟล์ PDF จริง
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
              Mitsui-Soko Logistics Km.30
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ปุ่ม Manage Events */}
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
            onClick={() => handleOpenPDF('https://example.com/events.pdf')} // เปลี่ยน URL เป็นไฟล์ PDF จริง
          >
            <CardContent>
              <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
              Mitsui-Soko Logistics Km.39 (Freezone)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Directory;