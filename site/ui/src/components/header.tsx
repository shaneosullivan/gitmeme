import { Link } from "gatsby";
import * as React from "react";

import "./header.css";

interface Props {
  siteTitle: string;
}

const Header = ({ siteTitle }: Props) => {
  let extraTitle = null;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    const token = decodeURIComponent(urlParams.get("token") || "") || null;
    if (token) {
      extraTitle = <span className="tokenTitle">for /{token}</span>;
    }
  }
  return (
    <header className="Header">
      <a href="/" className="header-icon">
        <img src="/icons/icon-48x48.png" />
      </a>
      <div className="Header-item">
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
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
          href="https://github.com/shaneosullivan/gitmeme/discussions"
          target="_blank"
          className="headerLink headerLinkSource non-mobile"
          style={{
            color: "white",
            textDecoration: "none",
            position: "absolute",
            top: "-4px",
            right: "216px",
          }}
        >
          Source
        </a>
        <a
          href="https://github.com/shaneosullivan/gitmeme/discussions"
          target="_blank"
          className="headerLink headerLinkFeedback"
        >
          Feedback
        </a>
        <a
          href="https://twitter.com/Gitmeme_rocks"
          target="_blank"
          className="headerLink headerLinkTwitter"
        >
          @Gitmeme_rocks
        </a>
      </div>
    </header>
  );
};

export default Header;
