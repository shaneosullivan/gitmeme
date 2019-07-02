import React, { useEffect, useState } from "react";
import "./App.css";
import { getGithubInfo, GithubInfo } from "./shared/auth/githubInfo";
import Login from "./components/Login";

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

  if (!auth.token) {
    return <Login onAuth={(authInfo: GithubInfo) => setAuth(authInfo)} />;
  }
  return <span>{"Hello " + auth.id}</span>;
};

export default App;
