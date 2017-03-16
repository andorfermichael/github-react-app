import { extendObservable, action, when } from "mobx";
import { fromPromise, REJECTED } from "mobx-utils";

export default class AboutStore {
  constructor({ githubAPI, sessionStore }) {
    extendObservable(this, {
      aboutDeferred: null,
      fetchAbout: action("fetchAbout", () => {
        when(
          // condition
          () =>
            sessionStore.authenticated &&
            (this.aboutDeferred === null ||
              this.aboutDeferred.state === REJECTED),
          // ... then
          () => {
            const userDeferred = sessionStore.userDeferred;
            this.aboutDeferred = fromPromise(
              githubAPI.userAbout(userDeferred.value)
            );
          }
        );
      })
    });
  }
}
