import axios from "axios";
import { Client } from "./HeadersConfig";
import { GETUSERIDBBYEMAIL_QUERY } from "./Query";
const authenticateURL = process.env.REACT_APP_AUTHENTICATE_URL;
var resp = "";
class AuthService {
  getAuth(token) {
    axios
      .post(authenticateURL, "", {
        headers: {
          "Accept-Encoding": "gzip,deflate,br",
          Connection: "keep-alive",
          "Authentication-token": token,
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        console.log("auth api response : ", response);
        resp = response;
        localStorage.setItem("jwt-token", response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    return resp;
  }

  getUser() {
    Client.query({
      query: GETUSERIDBBYEMAIL_QUERY,
      variables: {
        emailAddress: localStorage.getItem("email"),
      },
    })
      .then((response) => {
        let userId = response.data && response.data.getUser.userId;
        console.log("userId : ", userId);
        localStorage.setItem("userId", userId);
      })
      .catch((err) => console.error(err));
  }
}

export default new AuthService();
