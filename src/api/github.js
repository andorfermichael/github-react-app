import {CLIENT_ID, CLIENT_SECRET} from "../config/github-config"

export default class GithubAPI {
  constructor({ userToken }) {
    this.userToken = userToken;

    this.api_authentication = '';
    if (CLIENT_ID !== '' && CLIENT_SECRET !== '') {
      this.api_authentication = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    }

    this.defaultHeaders = {
      Authorization: `token ${this.userToken}`
    };
  }

  currentUser = () => {
    return fetch(`https://api.github.com/user${this.api_authentication}`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  userRepositories = ({ login }) => {
    return fetch(`https://api.github.com/users/${login}/repos${this.api_authentication}`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  repositoryIssues = (login, repo) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues${this.api_authentication}`, {
      headers: {
        ...this.defaultHeaders
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };

  postIssue = ({ login, repo, title, text }) => {
    return fetch(`https://api.github.com/repos/${login}/${repo}/issues${this.api_authentication}`, {
      method: "POST",
      headers: {
        ...this.defaultHeaders,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        body: text
      })
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    });
  };
}
