import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import PhotoUpload from "./components/PhotoUpload";
import Gallery from "./components/Gallery";
import Timeline from "./components/Timeline";
import Profile from "./components/Profile";
import Navigation from "./components/Navigation";
import { auth } from "./firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const App: React.FC = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/timeline" /> : <Home />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={user ? <PhotoUpload /> : <Navigate to="/" />}
        />
        <Route
          path="/gallery"
          element={user ? <Gallery /> : <Navigate to="/" />}
        />
        <Route
          path="/timeline"
          element={user ? <Timeline /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
