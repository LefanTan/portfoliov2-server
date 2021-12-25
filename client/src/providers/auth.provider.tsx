import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axiosInstance from "../services/axiosInstance";

type AuthData = {
  id: number;
  username: string;
  email: string;
};
const AuthContext = React.createContext<AuthData>({} as AuthData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthData>({} as AuthData);

  useEffect(() => {
    axiosInstance.get("/user/1").then((res) => console.log(res));
  });

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
