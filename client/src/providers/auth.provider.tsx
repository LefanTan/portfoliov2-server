import * as React from "react";
import { useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { AuthData, UserData } from "../types/auth.type";

export const AuthContext = React.createContext<AuthData>({} as AuthData);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<UserData>();
  const [loggedIn, setLoggedIn] = useState(false);

  // Run this to check if there is a user stored already,
  // and the current token is still valid
  const sync = async () => {
    let storedUser = localStorage.getItem("user");

    // User doesn't exist, user will have to log in
    if (!storedUser) {
      setLoggedIn(false);
    } else {
      const userObj = JSON.parse(storedUser) as UserData;

      // If user exist, check if token is still valid
      try {
        const res = await axiosInstance.get(`/user/${userObj.id}`);
        setUser({
          id: res.data.id,
          username: res.data.username,
          email: res.data.email,
        });

        setLoggedIn(true);
        return true;
      } catch (err) {
        console.log("Token outdated or doesn't exist!");
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loggedIn: loggedIn,
        sync: sync,
        signin: async (
          username_email: string,
          password: string,
          remember: boolean
        ) => {
          try {
            const res = await axiosInstance.post("/auth/signin", {
              username: username_email,
              email: username_email,
              password: password,
              rememberMe: remember,
            });

            const user = res.data.user as UserData;

            setLoggedIn(true);
            localStorage.setItem("user", JSON.stringify(user));

            return user;
          } catch (err: any) {
            throw err.response;
          }
        },
        signup: async (username: string, email: string, password: string) => {
          try {
            const res = await axiosInstance.post("/auth/signup", {
              username: username,
              email: email,
              password: password,
              roles: ["admin"],
            });

            const user = res.data.user as UserData;

            setLoggedIn(true);
            localStorage.setItem("user", JSON.stringify(user));

            return user;
          } catch (err: any) {
            throw err.response;
          }
        },
        signout: async () => {
          setUser(undefined);
          localStorage.removeItem("user");
          setLoggedIn(false);
          await axiosInstance.post("/auth/signout");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
