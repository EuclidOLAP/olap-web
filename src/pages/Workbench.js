import React from "react";
// import { Container } from "@mui/material";
import { Box } from "@mui/material";

function Workbench() {
  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* 第一部分：顶部菜单栏 */}
      <Box component="header"
        sx={{
          color: "white",
          height: "64px",
          width: "100%",
          backgroundColor: "primary.main"
        }}
      >
        header
      </Box>

      {/* 第二部分：主显示区 */}
      <Box component="main"
        sx={{
          flex: "1",
          width: "100%",
          overflowY: "auto"
        }}
      >
        main
      </Box>

      {/* 第三部分：底部辅助信息 */}
      <Box component="footer"
        sx={{
          color: "white",
          height: "32px",
          width: "100%",
          backgroundColor: "primary.dark"
        }}
      >
        footer
      </Box>
    </Box>
  );
}

export default Workbench;
