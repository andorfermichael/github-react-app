import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";
import {issueObject} from "../ui/issue-object";
export default inject("repoStore", "sessionStore", "viewStore")(
  observer(
    class RepositoryList extends React.Component {
      constructor({ repoStore, sessionStore, viewStore }) {
        super();
        repoStore.fetchRepos();
      }
      renderRepoList() {
        const {sessionStore, repoStore, viewStore} = this.props;

        if (sessionStore.authenticated) {
          const repoDeferred = repoStore.repoDeferred;
          const state = repoDeferred.state;
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
                    <Button onClick={repoStore.fetchRepos} text="retry"/>
                  </div>
                </div>
              );
            }
            case FULFILLED: {
              const repos = repoDeferred.value;
              return (
                <div>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Open issue</th>
                        <th>Issues list</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      repos.map(
                        (entry, index) =>
                          <tr key={entry.id}>
                            <td><a href={entry.html_url} target="_blank">{entry.name}</a></td>
                            <td>{entry.description}</td>
                            <td>
                              <Button
                                className="pt-button pt-minimal pt-icon-edit"
                                onClick={() => {issueObject.mode="open"; issueObject.repo=entry.name; issueObject.number=""; issueObject.title=""; issueObject.description=""; viewStore.push(viewStore.routes.issue())}}
                                text="open"
                              />
                            </td>
                            <td>
                              <Button
                                className="pt-button pt-minimal pt-icon-edit"
                                onClick={() => viewStore.push(viewStore.routes.issues({repo: entry.name}))}
                                text="show"
                              />
                            </td>
                          </tr>
                      )
                    }
                    </tbody>
                  </table>
                </div>
              );
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
            <h1>Repos</h1>
            {this.renderRepoList()}
          </div>
        );
      }
    }
  )
);
