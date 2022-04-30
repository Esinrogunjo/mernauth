import React, { useState } from "react";
import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
const Header = () => {
  const [value, setValue] = useState();
  return (
    <div>
      <AppBar position="sticky">
        <Typography variant="h3">MernAuth</Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <Tabs
            onChange={(e, val) => setValue(val)}
            value={value}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab to="/login" LinkComponent={Link} label="Login" />
            <Tab to="/signup" LinkComponent={Link} label="Signup" />
          </Tabs>
        </Box>
        <Toolbar></Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
