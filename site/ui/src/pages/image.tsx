import * as React from "react";
// import { Link } from "gatsby"

import Layout from "../components/layout";
import SEO from "../components/seo";
import InstallButton from "../components/install_button";

export default function ImagePage() {
  let imageUrl = null;
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    imageUrl = decodeURIComponent(urlParams.get("url") || "") || null;
  }
  return (
    <Layout>
      <SEO title="image" />
      {imageUrl ? renderImage(imageUrl) : <div />}
    </Layout>
  );
}

function renderImage(imageUrl: string): React.ReactNode {
  return (
    <div>
      <div>
        Get the Gitmeme browser extension to add fun images like this one to
        your Github issues and pull requests
      </div>
      <div>
        <InstallButton />
      </div>
      <img src={imageUrl} />
    </div>
  );
}
