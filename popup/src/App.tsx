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

  useEffect(() => {
    // Run on mount
    getGithubInfo().then(authInfo => {
      console.log("Popup got Github Info", authInfo);
      setAuth(authInfo);
    });
  }, []);

  if (!auth.id) {
    return null; // loading
  }
  // if (!auth.token) {
  //   return <Login onAuth={(authInfo: GithubInfo) => setAuth(authInfo)} />;
  // }
  return (
    <div className="App">
      <h1>GitMeme</h1>
      <Help />
      <TopTokensList
        userInfo={auth}
        onAuth={(authInfo: GithubInfo) => setAuth(authInfo)}
      />
    </div>
  );
};

export default App;
