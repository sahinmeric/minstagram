import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  LinearProgress,
} from "@mui/material";
import { auth, firestore, storage } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import {
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          setDisplayName(userData?.name || "");
          setPhotoURL(userData?.photoURL || "");
        } else {
          setDisplayName(user.displayName || "");
          setPhotoURL(user.photoURL || "");
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);

    try {
      let updatedPhotoURL = photoURL;

      if (profilePhoto) {
        const storageRef = ref(storage, `profilePhotos/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, profilePhoto);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            setSnackbarSeverity("error");
            setSnackbarMessage(`Error uploading profile photo: ${error}`);
            setSnackbarOpen(true);
            setLoading(false);
          },
          async () => {
            updatedPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateProfile(user, {
              displayName,
              photoURL: updatedPhotoURL,
            });

            await updateDoc(doc(firestore, "users", user.uid), {
              displayName,
              photoURL: updatedPhotoURL,
            });

            setSnackbarSeverity("success");
            setSnackbarMessage("Profile updated successfully!");
            setSnackbarOpen(true);
            setLoading(false);
            setUploadProgress(0);
          }
        );
      } else {
        if (
          displayName !== user.displayName ||
          updatedPhotoURL !== user.photoURL
        ) {
          await updateProfile(user, {
            displayName,
            photoURL: updatedPhotoURL,
          });

          await updateDoc(doc(firestore, "users", user.uid), {
            displayName,
            photoURL: updatedPhotoURL,
          });
        }

        if (newPassword && currentPassword) {
          const credential = EmailAuthProvider.credential(
            user.email || "",
            currentPassword
          );
          await reauthenticateWithCredential(user, credential);
          await updatePassword(user, newPassword);
        }

        setSnackbarSeverity("success");
        setSnackbarMessage("Profile updated successfully!");
        setSnackbarOpen(true);
        setLoading(false);
      }
    } catch (error) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`Error updating profile: ${error}`);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Box position="relative" display="inline-block">
          <Avatar src={photoURL} sx={{ width: 120, height: 120 }} />
          <label htmlFor="profile-photo">
            <input
              accept="image/*"
              id="profile-photo"
              type="file"
              style={{ display: "none" }}
              onChange={handleProfilePhotoChange}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              sx={{ position: "absolute", bottom: 0, right: 0 }}
            >
              <PhotoCamera />
            </IconButton>
          </label>
        </Box>
        {fileName && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {fileName}
          </Typography>
        )}
        {uploadProgress > 0 && (
          <Box sx={{ width: "30%", mt: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          sx={{ maxWidth: 400 }}
        />
        <Typography variant="h6" mt={2}>
          Change Password
        </Typography>
        <TextField
          label="Current Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ maxWidth: 400 }}
        />
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ maxWidth: 400 }}
        />
        <Box position="relative" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateProfile}
            disabled={loading}
            sx={{ maxWidth: 400 }}
          >
            {loading ? <CircularProgress size={24} /> : "UPDATE PROFILE"}
          </Button>
        </Box>
      </Box>
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

export default Profile;
