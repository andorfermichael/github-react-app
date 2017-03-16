import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";

export default inject("aboutStore", "sessionStore")(
  observer(
    class About extends React.Component {
      constructor({ aboutStore, sessionStore }) {
        super();
        aboutStore.fetchAbout();
      }
      renderAbout() {
        const {sessionStore, aboutStore} = this.props;

        if (sessionStore.authenticated) {
          const aboutDeferred = aboutStore.aboutDeferred;
          const state = aboutDeferred.state;
          switch (state) {
            case PENDING: {
              return <Spinner />;
            }
            case REJECTED: {
              return (
                <div className="pt-non-ideal-state">
                  <div
                    className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
                    <span className="pt-icon pt-icon-error" />
                  </div>
                  <h4 className="pt-non-ideal-state-title">Error occured</h4>
                  <div className="pt-non-ideal-state-description">
                    <Button onClick={aboutStore.fetchAbout} text="retry"/>
                  </div>
                </div>
              );
            }
            case FULFILLED: {
              const about = aboutDeferred.value;
              console.log(about);
              return (
                <div>
                  <img src={about.avatar_url} width="100" height="100"/>
                  <p><strong>Username:</strong><a href={about.html_url} target="_blank"> {about.login}</a></p>
                  <p><strong>Name:</strong> {about.name}</p>
                  <p><strong>Location:</strong> {about.location}</p>
                  <p><strong>Follower Count:</strong> {about.followers}</p>
                  <p><strong>Following Count:</strong> {about.following}</p>
                  <p><strong>Private Repo Count:</strong> {about.total_private_repos}</p>
                  <p><strong>Public Repo Count:</strong> {about.public_repos}</p>
                </div>
              );
              break;
            }
            default: {
              console.error("deferred state not supported", state);
            }
          }
        } else {
          return <h1>NOT AUTHENTICATED </h1>;
        }
      }
      render() {
        return (
          <div>
            <h1>About</h1>
            {this.renderAbout()}
          </div>
        );
      }
    }
  )
);