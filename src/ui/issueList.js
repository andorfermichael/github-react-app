import React from "react";
import { observer, inject } from "mobx-react";
import { PENDING, REJECTED, FULFILLED } from "mobx-utils";
import { Spinner, Button } from "@blueprintjs/core";
export default inject("repoStore", "sessionStore", "viewStore")(
  observer(
    class IssueList extends React.Component {
      constructor({ repoStore, sessionStore, viewStore, route }) {
        super();
        repoStore.fetchIssues(route.params.repo);
      }
      renderIssueList() {
        const {sessionStore, repoStore, route} = this.props;

        if (sessionStore.authenticated) {
          const issuesDeferred = repoStore.issuesDeferred;
          const state = issuesDeferred.state;
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
                    <Button onClick={repoStore.fetchIssues(route.params.repo)} text="retry"/>
                  </div>
                </div>
              );
            }
            case FULFILLED: {
              const issues = issuesDeferred.value;

              if (issues.length > 0) {
                return (
                  <div>
                    <table>
                      <thead>
                      <tr>
                        <th>Number</th>
                        <th>Titel</th>
                        <th>Text</th>
                        <th>State</th>
                        <th>Edit</th>
                        <th>Close</th>
                      </tr>
                      </thead>
                      <tbody>
                      {
                        issues.map(
                          (entry, index) =>
                            <tr key={entry.id}>
                              <td>#{entry.number}</td>
                              <td>{entry.title}</td>
                              <td>{entry.body}</td>
                              <td>{entry.state}</td>

                            </tr>
                        )
                      }
                      </tbody>
                    </table>
                  </div>
                );
              } else {
                return (
                  <div><p>No issues available for this repository!</p></div>
                )
              }
            }
            default: {
            }
          }
        } else {
          return <h1>NOT AUTHENTICATED </h1>;
        }
      }
      render() {
        return (
          <div>
            <h1>Issues</h1>
            {this.renderIssueList()}
          </div>
        );
      }
    }
  )
);
