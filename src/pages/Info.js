import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import MovieIcon from '@mui/icons-material/Movie';

const Info = () => {
  const [infoList, setInfoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('All');  // Track selected department
  const [searchQuery, setSearchQuery] = useState('');  // Track the search query

  const fetchInfo = async () => {
    try {
      const response = await fetch('http://192.168.5.12:5000/api/info');
      const data = await response.json();
      data.sort((a, b) => new Date(b.date) - new Date(a.date)); // assuming `date` field is present in your data
      setInfoList(data);
      setFilteredList(data);  // Initially show all items
    } catch (error) {
      console.error('Error fetching info:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleInfoClick = (info) => {
    setSelectedInfo(info);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedInfo(null);
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);

    if (department === 'All') {
      setFilteredList(infoList);  // Show all items
    } else {
      setFilteredList(infoList.filter(info => info.department === department));  // Filter by selected department
    }
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter the list based on the search query
    const filtered = infoList.filter((info) =>
      info.title.toLowerCase().includes(query.toLowerCase()) ||
      info.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const getFileTypeIcon = (fileUrl) => {
    if (!fileUrl) return null;
    if (fileUrl.match(/\.(jpeg|jpg|png|gif)$/)) return <img src={fileUrl} alt="File" style={{ width: '60%', height: '40%', borderRadius: '10px' }} />;
    if (fileUrl.match(/\.(mp4|mov|avi)$/)) return <MovieIcon sx={{ fontSize: 60, color: 'purple' }} />;
    if (fileUrl.endsWith('.pdf')) return <PictureAsPdfIcon sx={{ fontSize: 60, color: 'red' }} />;
    if (fileUrl.endsWith('.xls') || fileUrl.endsWith('.xlsx')) return <DescriptionIcon sx={{ fontSize: 60, color: 'green' }} />;
    return <InsertDriveFileIcon sx={{ fontSize: 60, color: 'gray' }} />;
  };

  const renderFileContent = (fileUrl, isImage) => {
    if (!fileUrl) return null;

    if (isImage) {
      return <img src={fileUrl} alt="File" style={{ display: 'block', margin: '0 auto', width: '50%', height: '20%' }} />;
    }

    if (fileUrl.match(/\.(mp4|mov|avi)$/)) {
      return <video controls src={fileUrl} style={{ width: '100%', height: 'auto' }} />;
    }

    if (fileUrl.endsWith('.pdf')) {
      return (
        <iframe src={fileUrl} width="100%" height="500px" title="PDF Viewer" />
      );
    }

    // For other types of files (e.g., .docx, .xlsx), allow download link
    return (
      <Button variant="contained" color="primary" href={fileUrl} target="_blank" sx={{ marginTop: '10px' }}>
        ดาวน์โหลดไฟล์
      </Button>
    );
  };

  // List of departments (you can also get this from your data, if necessary)
  const departments = ['All', 'IT', 'GA', 'HR'];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', padding: '0 10px', position: 'relative' }}>
      <Typography variant="h4" sx={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', color: '#1a237e' }}>
        Learning point
      </Typography>

      {/* Department filter buttons */}
      <Box sx={{ marginTop: '70px', marginLeft: '10px', padding: '10px' }}>
        {departments.map((department) => (
          <Button
            key={department}
            variant={selectedDepartment === department ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleDepartmentChange(department)}
            sx={{ marginRight: '10px', marginBottom: '10px' }}
          >
            {department}
          </Button>
        ))}
      </Box>

      {/* Search input field */}
      <Box sx={{ position: 'absolute', top: '20px', right: '30px', width: '250px' }}>
        <TextField
          label="ค้นหา"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          size="small"
        />
      </Box>

      <Box sx={{
        padding: '20px',
        marginTop: '100px',
        marginLeft: '180px',
        marginRight: '30px',
        borderRadius: '8px',
        maxHeight: 'calc(100vh - 150px)',  // กำหนดความสูงสูงสุดของกล่อง
        overflowY: 'auto',  // ให้เนื้อหาภายในกล่องสามารถเลื่อนได้
      }}>
        <Grid container spacing={2} justifyContent="flex-start">
          {/* Show all image, video, and document cards sorted by date */}
          {filteredList.map((info, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>  {/* Adjusted to show 5 cards per row */}
              <Card sx={{
                borderRadius: '15px',
                backgroundImage: 'url(Bginfo.jpg)', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': { 
                  transform: 'scale(1.05)', 
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)' 
                },
                cursor: 'pointer',
                textAlign: 'center',
                padding: '8px',
                height: '90%', 
                color: 'white',
                display: 'flex',
                flexDirection: 'column', // Flex layout to arrange image and text vertically
                justifyContent: 'space-between' // This will make sure the image and text stay separated
              }} onClick={() => handleInfoClick(info)}>
                <CardContent sx={{ padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Check if the fileUrl is an image and display it */}
                  {info.fileUrl && info.fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                    <img src={info.fileUrl} alt={info.title} style={{ 
                      width: '100%', 
                      height: 'auto', 
                      maxHeight: '150px', // Restrict the height of the image
                      objectFit: 'cover', // Ensure image fits within the box without distortion
                      borderRadius: '10px' 
                    }} />
                  ) : (
                    getFileTypeIcon(info.fileUrl)
                  )}

                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 'bold',
                      color: 'white',
                      marginTop: '10px',
                      whiteSpace: 'nowrap',  // Prevent wrapping of text
                      overflow: 'hidden',  // Hide the overflow text
                      textOverflow: 'ellipsis',  // Add "..." when text overflows
                      display: 'inline-block',
                      width: '100%',  // Ensure it occupies the full width to apply the truncation
                    }}
                  >
                    {info.title}
                  </Typography>

                  {/* Display the department */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'white', 
                      marginTop: '5px',
                      fontSize: '0.9rem', 
                      fontStyle: 'italic', 
                      textOverflow: 'ellipsis',
                      overflow: 'hidden', 
                      whiteSpace: 'nowrap'
                    }}
                  >
                    แผนก: {info.department}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {selectedInfo && (
        <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ backgroundColor: '#e3f2fd', color: '#2c387e' }}>
            {selectedInfo.title}
          </DialogTitle>
          <DialogContent>
            {/* Check if the selected info is an image */}
            {renderFileContent(selectedInfo.fileUrl, selectedInfo.fileUrl && selectedInfo.fileUrl.match(/\.(jpeg|jpg|png|gif)$/))}
            <Typography variant="body1" sx={{ marginTop: '10px', color: '#424242' }}>
              {selectedInfo.content}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#e3f2fd' }}>
            <Button onClick={handleDialogClose} color="primary" variant="contained" sx={{ fontWeight: 'bold' }}>
              ปิด
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Info;
