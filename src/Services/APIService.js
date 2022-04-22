class APIService {
  constructor() {
    this.domain = "http://localhost:4000/";
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  request(url) {
    return fetch(this.domain + url);
  }

  get(url, method = "GET") {
    return fetch(this.domain + url, { method, headers: this.headers });
  }

  post(url, id, method = "POST") {
    return fetch(this.domain + url, id, { method, headers: this.headers });
  }
}

export default APIService;
