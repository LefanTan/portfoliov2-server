import { useContext, useState } from "react";
import { AuthContext } from "../../providers/auth.provider";
import { Header } from "../main/header";
import Profile from "../main/profile";
import Projects from "../main/projects";
import MainButton from "../widgets/mainbutton";
import styles from "./home.module.css";
import { FaRegCopy } from "react-icons/fa";
import copy from "copy-to-clipboard";

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const [tooltip, setToolTip] = useState("Copy to clipboard");

  const generateKeyHandler = () => {
    if (
      window.confirm(
        "Are you sure you want to generate a new key? The existing key will be replaced"
      )
    ) {
      authContext.generateApiKey();
    }
  };

  const copyToClipboard = () => {
    if (authContext.user?.apiKey) {
      copy(authContext.user?.apiKey);
      setToolTip("Copied!");
    }
  };

  return (
    <div className="body">
      <Header />
      <main className={styles.main}>
        <div className={styles.row}>
          <h1 className={styles.title}>Welcome back!</h1>
          <div className={styles.row}>
            <h3>
              <strong>API Key: </strong>
            </h3>
            <h3 className={styles.key}>
              {authContext?.user?.apiKey?.slice(0, 25) + "..." ??
                "Not Generated"}
              <button
                data-tooltip={tooltip}
                className={styles.tooltip}
                onClick={copyToClipboard}
                onMouseLeave={() => setToolTip("Copy to clipboard")}
              >
                <FaRegCopy size={15} />
              </button>
            </h3>
            <MainButton onclick={generateKeyHandler}>Generate</MainButton>
          </div>
        </div>
        <Profile />
        <Projects />
      </main>
    </div>
  );
};

export default HomePage;
