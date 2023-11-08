import * as React from "react";

import styles from "./InstallButton.module.css";

export default function InstallButton() {
  return (
    <a
      className={styles.InstallButton}
      href="https://chrome.google.com/webstore/detail/gitmeme/bjpibkoafohcjghgpbiinhfoobmbijcc"
    >
      Install Now
    </a>
  );
}
