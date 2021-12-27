import ReactDOM from "react-dom";
import App from "./App";
import AuthProvider from "./providers/auth.provider";

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById("root")
);
