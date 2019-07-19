import { Link } from "gatsby";
import * as React from "react";

import "./header.css";

interface Props {
  siteTitle: string;
}

const Header = ({ siteTitle }: Props) => (
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
        </Link>
      </h1>
    </div>
  </header>
);

export default Header;
