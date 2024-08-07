import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  List,
  ListItem,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  QuerySnapshot,
  DocumentData,
  arrayUnion,
  orderBy,
} from "firebase/firestore";
import { firestore, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import FlagIcon from "@mui/icons-material/Flag";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  userName: string;
  userId: string;
  comment: string;
}

interface Photo {
  id: string;
  url: string;
  description: string;
  createdAt: any;
  userName: string;
  likes: number;
  profilePhotoURL: string;
  comments?: Comment[];
}

const Timeline: React.FC = () => {
  const [user] = useAuthState(auth);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newComment, setNewComment] = useState("");
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const fetchPhotos = async () => {
      if (user) {
        const q = query(
          collection(firestore, "photos"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        const photosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photo[];
        setPhotos(photosData);
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [user]);

  const handleLike = async (photoId: string, currentLikes: number) => {
    try {
      const photoDocRef = doc(firestore, "photos", photoId);
      await updateDoc(photoDocRef, { likes: currentLikes + 1 });
      setPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === photoId ? { ...photo, likes: currentLikes + 1 } : photo
        )
      );
    } catch (error) {
      console.error("Error updating likes:", error);
      alert(`Error updating likes: ${error}`);
    }
  };

  const handleAddComment = async (photoId: string) => {
    if (user && newComment.trim()) {
      try {
        const comment = {
          userName: user.displayName || "Anonymous",
          userId: user.uid,
          comment: newComment.trim(),
        };

        const photoDocRef = doc(firestore, "photos", photoId);
        await updateDoc(photoDocRef, {
          comments: arrayUnion(comment),
        });

        setNewComment("");

        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) =>
            photo.id === photoId
              ? {
                  ...photo,
                  comments: [...(photo.comments || []), comment],
                }
              : photo
          )
        );
        setSnackbarSeverity("success");
        setSnackbarMessage("Comment added successfully!");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error adding comment:", error);
        setSnackbarSeverity("error");
        setSnackbarMessage("Error adding comment. Please try again later.");
        setSnackbarOpen(true);
      }
    }
  };

  const handleExpandClick = (photoId: string) => {
    setExpanded(expanded === photoId ? null : photoId);
  };

  const handleReport = (photoId: string) => {
    console.log(`Reported photo with id: ${photoId}`);
    setSnackbarSeverity("success");
    setSnackbarMessage("Photo reported successfully.");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Stack alignItems="center" spacing={3} marginTop={3}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="60vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          photos.map((photo) => (
            <Card key={photo.id} style={{ width: "100%", maxWidth: "600px" }}>
              <CardHeader
                avatar={
                  <Avatar src={photo.profilePhotoURL}>
                    {photo.userName[0]}
                  </Avatar>
                }
                action={
                  <Tooltip title="Report">
                    <IconButton onClick={() => handleReport(photo.id)}>
                      <FlagIcon />
                    </IconButton>
                  </Tooltip>
                }
                title={photo.userName}
                subheader={formatDistanceToNow(photo.createdAt.toDate(), {
                  addSuffix: true,
                })}
              />
              <CardMedia
                component="img"
                style={{ objectFit: "contain" }}
                image={photo.url}
                alt={photo.description}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {photo.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <Stack direction="row" alignItems="center">
                  <IconButton onClick={() => handleLike(photo.id, photo.likes)}>
                    <FavoriteIcon color="error" />
                  </IconButton>
                  <Typography variant="body2">{photo.likes}</Typography>
                  <IconButton onClick={() => handleExpandClick(photo.id)}>
                    <CommentIcon color="primary" />
                  </IconButton>
                  <Typography variant="body2" color="textSecondary">
                    {photo.comments ? photo.comments.length : 0}
                  </Typography>
                </Stack>
              </CardActions>
              <Collapse in={expanded === photo.id} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography>Comments</Typography>
                  <List disablePadding>
                    {photo.comments &&
                      photo.comments.map((comment, index) => (
                        <ListItem key={index}>
                          <Typography variant="body2">
                            <strong>{comment.userName}: </strong>{" "}
                            {comment.comment}
                          </Typography>
                        </ListItem>
                      ))}
                  </List>
                  <TextField
                    label="Add a comment"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddComment(photo.id)}
                  >
                    Post Comment
                  </Button>
                </CardContent>
              </Collapse>
            </Card>
          ))
        )}
      </Stack>
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

export default Timeline;
