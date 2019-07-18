import React, { useEffect, useState } from "react";
import "./App.css";
import { getGithubInfo, GithubInfo } from "./shared/auth/githubInfo";
import TopTokensList from "./components/TopTokensList";
import Help from "./components/Help";

const App = () => {
  const [auth, setAuth] = useState({
    token: "",
    id: "",
    avatar: ""
  } as GithubInfo);
  const [authComplete, setAuthComplete] = useState(false);

  useEffect(() => {
    // Run on mount
    getGithubInfo().then(authInfo => {
      setAuth(authInfo);
      setAuthComplete(true);
    });
  }, []);

  return (
    <div className="App">
      <Help />
      {authComplete ? (
        <TopTokensList
          userInfo={auth}
          onAuth={(authInfo: GithubInfo) => setAuth(authInfo)}
        />
      ) : null}
    </div>
  );
};

export default App;
