import { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./providers/auth.provider";
import "./style.css";
import HomePage from "./components/pages/home.page";
import SignInPage from "./components/pages/signin.page";
import SignUpPage from "./components/pages/signup.page";
import { PrivateRoute, PublicRoute } from "./components/routes";
import SignOutPage from "./components/pages/signout.page";
import NotFoundPage from "./components/pages/notfound.page";
import Project from "./components/pages/project.page";

/**
 * TODO: Use React.lazy and React.suspense in the future!
 */

const App = () => {
  const authContext = useContext(AuthContext);
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * When directing to a new route, useEffect[] never gets called
   * so authContext.loggedIn will be used as dependency
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const authed = await authContext.sync();
      setAuth(authed);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext.loggedIn]);

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
        <Route path="/signout" element={<SignOutPage />} />
        <Route
          path="/project/:id"
          element={
            <PrivateRoute isLoading={loading} isAuthenticated={auth}>
              <Project />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/create"
          element={
            <PrivateRoute isLoading={loading} isAuthenticated={auth}>
              <Project />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
