import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import AdminOrClientRoute from "./security/AdminOrClientRoute";
import AboutPage from "./components/pages/AboutPage";
import Navbar from "./components/Navbar";
import NotFound from "./components/pages/NotFound";
import PrivateRoute from "./security/PrivateRoute";
import ProfileEditPage from "./components/pages/ProfileEditPage";

const App: React.FC = () => {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<AdminOrClientRoute />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/profile-edit"
          element={<PrivateRoute component={ProfileEditPage} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Fragment>
  );
};

export default App;
