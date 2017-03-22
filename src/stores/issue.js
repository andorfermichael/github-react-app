import { extendObservable, action } from "mobx";

export default class IssueStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      postIssue: action("postIssue", (issueobject) => {
        return githubAPI.postIssue({
          login: sessionStore.userDeferred.value.login,
          issueobject
        });
      })
    });
  }
}
