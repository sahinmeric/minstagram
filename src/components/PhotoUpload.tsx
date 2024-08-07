import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { storage, firestore, auth } from "../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const PhotoUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (file && user) {
      try {
        setUploading(true);
        const storageRef = ref(storage, `photos/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setUploading(false);
            setSnackbarSeverity("error");
            setSnackbarMessage(`Error uploading photo: ${error}`);
            setSnackbarOpen(true);
          },
          async () => {
            const url = await getDownloadURL(storageRef);

            await addDoc(collection(firestore, "photos"), {
              url,
              description,
              user: user.uid,
              userName: user.displayName || "Anonymous",
              profilePhotoURL: user.photoURL || "",
              createdAt: serverTimestamp(),
              likes: 0,
              comments: [],
            });

            setDescription("");
            setFile(null);
            setUploading(false);
            setSnackbarSeverity("success");
            setSnackbarMessage("Photo uploaded successfully!");
            setSnackbarOpen(true);

            // Navigate to the timeline after successful upload
            setTimeout(() => navigate("/timeline"), 1000); // Navigate after 1 second to show the snackbar
          }
        );
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage(`Error uploading photo: ${error}`);
        setSnackbarOpen(true);
        setUploading(false);
      }
    } else {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please select a file and enter a description");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container component="main" maxWidth="sm">
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
          Upload a Photo
        </Typography>
        <Box
          component="form"
          sx={{
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            component="label"
            fullWidth
            size="small"
            sx={{ mt: 3, mb: 2 }}
          >
            Choose File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              File: {file.name}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            autoComplete="off"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {uploading && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="textSecondary">
                Uploading: {Math.round(uploadProgress)}%
              </Typography>
            </Box>
          )}
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={handleUpload}
            sx={{ mt: 3, mb: 2 }}
            disabled={uploading || !file || description === "" || user === null}
          >
            Upload
          </Button>
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

export default PhotoUpload;
