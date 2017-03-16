import React from "react";
import ReactDOM from "react-dom";
import { autorun } from "mobx";
import { Provider } from "mobx-react";
import DevTools from "mobx-react-devtools";
import SessionStore from "./stores/session";
import ViewStore from "./stores/view";
import GithubApp from "./ui/githubApp";
import GithubAPI from "./api/github";
import RepoStore from "./stores/repo";
import AboutStore from "./stores/about";
import IssueStore from "./stores/issue";
import "./index.css";

// wire up dependencies
const githubAPI = new GithubAPI({ 
  userToken: "c5d660a9402e19074d64e69330a191dcd7ae4b74"
});
const sessionStore = new SessionStore({ githubAPI });
const viewStore = new ViewStore();
const repoStore = new RepoStore({ githubAPI, sessionStore });
const aboutStore = new AboutStore({ githubAPI, sessionStore });
const issueStore = new IssueStore({ githubAPI, sessionStore });

// render the whole application
// provider is a kind of dependency injection system
function renderApp() {
  ReactDOM.render(
    <div>
      <DevTools position={{ bottom: 0, right: 10 }} />
      <Provider sessionStore={sessionStore} viewStore={viewStore} repoStore={repoStore} issueStore={issueStore} aboutStore={aboutStore}>
        <GithubApp />
      </Provider>
    </div>,
    document.getElementById("root")
  );
}

// callback for MOBX to indicate a rerender
autorun(renderApp);
