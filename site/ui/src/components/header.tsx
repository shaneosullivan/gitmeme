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
      extraTitle = <span className="tokenTitle">/{token}</span>;
    }
  }
  return (
    <header className="Header">
      <div className="Header-item">
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`
            }}
          >
            {siteTitle || ""}
            {extraTitle}
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;
