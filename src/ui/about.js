import React from "react";
import { observer, inject } from "mobx-react";

export default inject("sessionStore")(
  observer(
    class About extends React.Component {
      constructor({ sessionStore }) {
        super();
      }
      renderAbout() {
        const {sessionStore} = this.props;

        if (sessionStore.authenticated) {
          const currentUser = sessionStore.currentUser;

          return (
            <div>
              <img src={currentUser.avatar_url} width="100" height="100" alt={currentUser.name}/>
              <p><strong>Username:</strong><a href={currentUser.html_url} target="_blank"> {currentUser.login}</a></p>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Location:</strong> {currentUser.location}</p>
              <p><strong>Follower Count:</strong> {currentUser.followers}</p>
              <p><strong>Following Count:</strong> {currentUser.following}</p>
              <p><strong>Private Repo Count:</strong> {currentUser.total_private_repos}</p>
              <p><strong>Public Repo Count:</strong> {currentUser.public_repos}</p>
            </div>
          );
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