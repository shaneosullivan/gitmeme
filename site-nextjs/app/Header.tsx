import * as React from "react";

import styles from "./Header.module.css";
import Link from "next/link";

interface Props {
  siteTitle: string;
}

const Header = ({ siteTitle }: Props) => {
  let extraTitle = null;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = decodeURIComponent(urlParams.get("token") || "") || null;
    if (token) {
      extraTitle = <span className={styles.tokenTitle}>for /{token}</span>;
    }
  }
  return (
    <header className={styles.Header}>
      <a href="/" className={styles.headerIcon}>
        <img src="/icons/icon-48x48.png" />
      </a>
      <div className={styles.Item}>
        <h1 style={{ margin: 0 }}>
          <Link
            href="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle || ""}
            {extraTitle}
          </Link>
        </h1>
        <a
          href="https://github.com/shaneosullivan/gitmeme"
          target="_blank"
          className={`${styles.headerLink} ${styles.headerLinkSource} non-mobile`}
          style={{
            color: "white",
            textDecoration: "none",
            position: "absolute",
          }}
        >
          Source
        </a>
        <a
          href="https://github.com/shaneosullivan/gitmeme/discussions"
          target="_blank"
          className={`${styles.headerLink} ${styles.headerLinkFeedback}`}
        >
          Feedback
        </a>
        <a
          href="https://twitter.com/Gitmeme_rocks"
          target="_blank"
          className={`${styles.headerLink} ${styles.headerLinkTwitter}`}
        >
          @Gitmeme_rocks
        </a>
      </div>
    </header>
  );
};

export default Header;
