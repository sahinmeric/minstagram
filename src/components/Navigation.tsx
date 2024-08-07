import React from "react";
import { AppBar, Toolbar, Button, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navigation: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Minstagram
        </Typography>
        {user && (
          <>
            <Button color="inherit" onClick={() => navigate("/upload")}>
              Upload
            </Button>
            <Button color="inherit" onClick={() => navigate("/gallery")}>
              Gallery
            </Button>
            <Button color="inherit" onClick={() => navigate("/timeline")}>
              Timeline
            </Button>
            <IconButton color="inherit" onClick={() => navigate("/profile")}>
              <AccountCircleIcon />
            </IconButton>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
