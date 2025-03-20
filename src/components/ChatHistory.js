import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

const ChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);

  // 📌 Fetch all messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.5.12:5000/api/chats', {
        params: {
          user_id: userId,
          recipient_id: selectedUser ? selectedUser.user_id : null,
        },
      });
      
      if (response.status === 200 && Array.isArray(response.data)) {
        setMessages(response.data); // Use the data from the API
      } else {
        console.error("No chat history found");
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [userId, selectedUser]);

  // 📌 Fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('http://192.168.5.12:5000/api/users');
      if (response.status === 200 && response.data) {
        setUserId(response.data.user_id);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchMessages(); // Fetch the messages when the page is loaded
  }, [fetchMessages, userId, selectedUser]); // Re-run when userId or selectedUser changes

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box sx={{ padding: '40px 0', background: 'linear-gradient(to bottom, #F8F0E5 15%, #EADBC8 45%, #DAC0A3 75%, #102C57 150%)', minHeight: '100vh', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ color:'black', fontWeight: 600, textAlign: 'center', marginBottom: '40px' }}>
        Chat History
      </Typography>

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
        </Card>
      </Grid>
    </Box>
  );
};

export default ChatHistory;
