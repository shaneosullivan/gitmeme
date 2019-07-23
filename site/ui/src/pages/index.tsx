import * as React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { API_ROOT_URL } from "../shared/consts";
import {
  SpringGrid,
  measureItems,
  makeResponsive,
  layout
} from "react-stonecutter";

import "./index.css";
import InstallButton from "../components/install_button";

const Grid = makeResponsive(measureItems(SpringGrid, { measureImages: true }), {
  maxWidth: 1280,
  minPadding: 100
});

interface ApiTokenInfo {
  token: string;
  image_url: string;
  count: number;
}

interface ApiTokenResult {
  global: Array<ApiTokenInfo>;
  user: Array<ApiTokenInfo>;
}

export default function IndexPage() {
  const [topTokens, setTopTokens] = React.useState([]);
  const [loadError, setLoadError] = React.useState(null);

  React.useEffect(() => {
    fetch(`${API_ROOT_URL}/top_tokens?count=10`)
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Top tokens fetch failed");
        }
      })
      .then((res: ApiTokenResult) => {
        setTopTokens(res.global);
      })
      .catch(err => {
        console.error(err);
        setLoadError("Failed to load top tokens");
      });
  }, []);

  function renderError() {
    return <div>{loadError}</div>;
  }

  function renderImageList(tokens: Array<ApiTokenInfo>) {
    if (tokens.length === 0) {
      return null;
    }

    return (
      <Grid
        component="ul"
        columns={5}
        columnWidth={200}
        gutterWidth={5}
        gutterHeight={5}
        layout={layout.pinterest}
        duration={800}
        easing="ease-out"
      >
        {tokens.map(token => {
          return (
            <div>
              <h3>/{token.token}</h3>
              <img src={token.image_url} style={{ width: "200px" }} />
            </div>
          );
        })}
      </Grid>
    );
  }

  return (
    <Layout>
      <SEO title="Home" />
      <div style={{ textAlign: "center" }}>
        <InstallButton />
      </div>
      <p>
        GitMeme brings lots of fun to Github by making it easy to include Gifs
        in your comments. In any text box, just type a forward slash and some
        text to insert an image, e.g <span className="token">/shipit</span>
      </p>
      <h2>Trending Memes</h2>
      {loadError ? renderError() : renderImageList(topTokens)}
    </Layout>
  );
}
