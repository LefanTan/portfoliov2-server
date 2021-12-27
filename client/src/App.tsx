import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider, { AuthContext } from "./providers/auth.provider";
import "./style.css";
import HomePage from "./components/pages/home.page";
import SignInPage from "./components/pages/signin.page";
import SignUpPage from "./components/pages/signup.page";
import { PrivateRoute, PublicRoute } from "./components/routes";
import Loading from "./components/loading";

const App = () => {
  const authContext = useContext(AuthContext);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!authContext.user && !authContext.loggedIn) {
        const authed = await authContext.sync();
        setAuth(authed);
        setLoading(false);
      }
    })();
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isLoading={loading} isAuthenticated={auth}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute isLoading={loading} isAuthenticated={auth}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute isLoading={loading} isAuthenticated={auth}>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute isLoading={loading} isAuthenticated={auth}>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route path="/signout" element={<SignInPage signout={true} />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
