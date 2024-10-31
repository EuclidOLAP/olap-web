import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Header() {
  return (
    <AppBar position="static" style={{ backgroundColor: '#003366' }}>
      <Toolbar>
        <Typography variant="h6" component="div">
          EuclidOLAP WEB
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
