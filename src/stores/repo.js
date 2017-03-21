import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class Repo {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      repoDeferred: null,
      issuesDeferred: null,
      fetchRepos: action("fetchRepos", () => {
        when(
          // condition
          () =>
            sessionStore.authenticated &&
            (this.repoDeferred === null ||
              this.repoDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.repoDeferred = fromPromise(
              githubAPI.userRepositories(userDeferred.value)
            );
          }
        );
      }),
      fetchIssues: action("fetchIssues", (repo) => {
        when(
          // condition
          () =>
          sessionStore.authenticated,
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.issuesDeferred = fromPromise(
              githubAPI.repositoryIssues(userDeferred.value.login, repo)
            );
          }
        );
      }),
      postIssue: action("postIssue", () => {
        githubAPI.postIssue({
          login: sessionStore.userDeferred.value.login,
          repo: "issuetest"
        });
      })
    });
  }
}
