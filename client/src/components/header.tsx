import * as React from "react";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header>
      <h1>Portfolio API</h1>
      <nav>
        <ul className={styles.nav_links}>
          <li>
            <a href="#">Profile</a>
          </li>
          <li>
            <a href="#">Projects</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
