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

  useEffect(() => {
    (async () => {
      if (!authContext.user && !authContext.loggedIn) {
        const authed = await authContext.sync();
        setAuth(authed);
      }
    })();
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isAuthenticated={auth}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute isAuthenticated={auth}>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <PublicRoute isAuthenticated={auth}>
              <SignInPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute isAuthenticated={auth}>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signout"
          element={
            <PublicRoute isAuthenticated={auth}>
              <SignInPage signout={true} />
            </PublicRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
