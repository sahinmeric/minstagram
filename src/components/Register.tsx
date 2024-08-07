import React, { useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import { auth, firestore } from "../firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      await setDoc(doc(firestore, "users", user.uid), {
        name: username,
        email: user.email,
      });

      setSnackbarSeverity("success");
      setSnackbarMessage("User registered successfully!");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/timeline"), 1000);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "This email is already registered, please login instead."
        );
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(`Error registering user: ${error.message}`);
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 1,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="username"
            label="Username"
            id="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Box position="relative" mt={2}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleRegister}
              disabled={loading || !email || !password || !username}
              sx={{ maxWidth: 400 }}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Box>
        </Box>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
