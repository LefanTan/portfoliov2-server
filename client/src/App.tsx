import { useEffect } from "react";
import { Header } from "./components/header";
import AuthProvider from "./providers/auth.provider";
import "./style.css";

export default function App() {
  return (
    <AuthProvider>
      <div className="main">
        <Header />
      </div>
    </AuthProvider>
  );
}
