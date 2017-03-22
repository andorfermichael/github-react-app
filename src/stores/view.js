import createHistory from "history/createBrowserHistory";
import { extendObservable, computed } from "mobx";
import React from "react";
import Issue from "../ui/issue";
import About from "../ui/about";
import RepositoryList from "../ui/repositoryList";
import IssueList from "../ui/issueList";
import RouteNotFound from "../ui/routeNotFound";
import {issueObject} from "../ui/issue-object";
import myro from "myro";

const history = createHistory();

const routeDefinitions = {
  "/": "home",
  "/repos": "repos",
  "/issues/:repo": "issues",
  "/about": "about",
  "/issue": {
    name: 'issue',
    props: {
      issueobject: issueObject
    }
  }
};

const routes = myro(routeDefinitions);

export default class ViewStore {
  constructor() {
    history.listen(location => {
      this.location = location.pathname;
    });

    this.routes = routes;

    extendObservable(this, {
      location: window.location.pathname,
      push: url => history.push(url),
      currentView: computed(() => {
        const route = routes(this.location) || {};
        switch (route.name) {
          case "about": {
            return {
              ...route,
              component: About
            };
          }
          case "repos": {
            return {
              ...route,
              component: RepositoryList
            };
          }
          case "issues": {
            return {
              ...route,
              component: IssueList
            };
          }
          case "issue": {
            console.log(route);
            return {
              ...route,
              component: Issue
            };
          }
          default: {
            if (this.location === "/") {
              return {
                name: 'home',
                component: () => <div>HOME</div>
              };
            }

            return {
              name: "notfound",
              component: RouteNotFound
            };
          }
        }
      })
    });
  }
}
