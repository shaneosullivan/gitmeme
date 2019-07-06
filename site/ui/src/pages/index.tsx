import * as React from "react";
// import { Link } from "gatsby"

import Layout from "../components/layout";
import SEO from "../components/seo";

export default function IndexPage() {
  return (
    <Layout>
      <SEO title="Home" />
      <img src="https://soon.horse/soon-horse.jpg" />
    </Layout>
  );
}
