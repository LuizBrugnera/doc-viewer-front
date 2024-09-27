import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import AutorizationMiddlewareRoute from "./security/AutorizationMiddlewareRoute";
import AboutPage from "./components/pages/AboutPage";
import Navbar from "./components/Navbar";
import NotFound from "./components/pages/NotFound";
import PrivateRoute from "./security/PrivateRoute";
import ProfileEditPage from "./components/pages/ProfileEditPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import VerifyCodePage from "./components/pages/VerifyCode";
import ResetPasswordPage from "./components/pages/ResetPassword";
import FolderSistem from "./components/FolderSistem";

const App: React.FC = () => {
  return (
    <Fragment>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<AutorizationMiddlewareRoute />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/folder-site" element={<FolderSistem />} />
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
