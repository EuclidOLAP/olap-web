import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Header from '../components/Header';

function Workbench() {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box display="flex" flex="1" overflow="auto">
        {/* left Box */}
        <Box width="270px" maxWidth="320px" bgcolor="#f0f0f0">
        </Box>
        {/* right Box */}
        <Box flexGrow={1}>
          <Button variant="contained" color="primary"
            onClick={() => openInNewTab('/dimension-model-management')}>
            &gt;&gt;&gt; Dimension Model Management &lt;&lt;&lt;
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Workbench;