import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Collapse,
  List,
  ListItem,
  Button,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

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

const Gallery: React.FC = () => {
  const [user] = useAuthState(auth);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [expandedPhotoId, setExpandedPhotoId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      if (user) {
        const q = query(
          collection(firestore, "photos"),
          where("user", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const photosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photo[];
        setPhotos(photosData);
      }
    };

    fetchPhotos();
  }, [user]);

  const handleClickOpen = (photo: Photo) => {
    setSelectedPhoto(photo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPhoto(null);
  };

  const handleExpandClick = (photoId: string) => {
    setExpandedPhotoId(expandedPhotoId === photoId ? null : photoId);
  };

  const handleUploadRedirect = () => {
    navigate("/upload");
  };

  return (
    <Container>
      {photos.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="80vh"
          textAlign="center"
        >
          <Typography variant="h6" gutterBottom>
            You have not uploaded any image yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadRedirect}
          >
            Upload an Image
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.url}
                  alt={photo.description}
                  style={{ objectFit: "cover" }}
                  onClick={() => handleClickOpen(photo)}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {formatDistanceToNow(photo.createdAt.toDate(), {
                      addSuffix: true,
                    })}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <FavoriteIcon color="error" />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ ml: 1 }}
                    >
                      {photo.likes}
                    </Typography>
                    <IconButton onClick={() => handleExpandClick(photo.id)}>
                      <CommentIcon color="primary" />
                    </IconButton>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ ml: 1 }}
                    >
                      {photo.comments ? photo.comments.length : 0}
                    </Typography>
                  </Box>
                  <Collapse
                    in={expandedPhotoId === photo.id}
                    timeout="auto"
                    unmountOnExit
                  >
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
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          {selectedPhoto && (
            <Box position="relative">
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.description}
                style={{ width: "100%", height: "auto" }}
              />
              <CardContent>
                <Typography variant="h6">
                  {selectedPhoto.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatDistanceToNow(selectedPhoto.createdAt.toDate(), {
                    addSuffix: true,
                  })}
                </Typography>
                <Box display="flex" alignItems="center">
                  <FavoriteIcon color="error" />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 1 }}
                  >
                    {selectedPhoto.likes}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <CommentIcon color="primary" />
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ ml: 1 }}
                  >
                    {selectedPhoto.comments ? selectedPhoto.comments.length : 0}
                  </Typography>
                </Box>
                <List disablePadding>
                  {selectedPhoto.comments &&
                    selectedPhoto.comments.map((comment, index) => (
                      <ListItem key={index}>
                        <Typography variant="body2">
                          <strong>{comment.userName}: </strong>{" "}
                          {comment.comment}
                        </Typography>
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Gallery;
