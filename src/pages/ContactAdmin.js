import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const ContactAdmin = () => {
  return (
    <Box sx={{ padding: '20px 0', background: 'linear-gradient(to bottom, #102C57, #bbdefb)', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          color: '#F8F0E5',
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        IT Contact
      </Typography>

      {/* Centered grid container */}
      <Grid
        container
        justifyContent="center"  // Center items horizontally
        alignItems="center"      // Center items vertically
        spacing={4}
      >
        {/* Card for first contact */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              {/* Profile image */}
              <Box
                sx={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 20px auto',
                }}
              >
                <img
                  src="/Pboy.jpg" // Replace with the actual image URL
                  alt="Admin 1"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              {/* Name */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c387e' }}>
                Paphan
              </Typography>

              {/* Contact info */}
              <Typography variant="body1" sx={{ color: '#424242', marginTop: '10px' }}>
                <strong>Phone:</strong> 02-715-6588
              </Typography>
              <Typography variant="body1" sx={{ color: '#424242', marginTop: '5px' }}>
                <strong>Email:</strong> Paphan@mitsui-soko.co.th
              </Typography>
            </CardContent>
          </Card>
        </Grid>


        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ maxWidth: 345, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              {/* Profile image */}
              <Box
                sx={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto 20px auto',
                }}
              >
                <img
                  src="/Pkon.jpg" // Replace with the actual image URL
                  alt="Admin 2"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              {/* Name */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c387e' }}>
                Phalat
              </Typography>

              {/* Contact info */}
              <Typography variant="body1" sx={{ color: '#424242', marginTop: '10px' }}>
                <strong>Phone:</strong> 02-715-6589
              </Typography>
              <Typography variant="body1" sx={{ color: '#424242', marginTop: '5px' }}>
                <strong>Email:</strong> Phalat@mitsui-soko.co.th
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactAdmin;
