import { ApolloClient } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/core";

const url = process.env.REACT_APP_GRAPHQL_SERVICE_URL;

function Config(userId, authToken) {
  const headers = {
    "Accept-Encoding": "gzip,deflate,br",
    Connection: "keep-alive",
    // userId: "18",
    userId: userId,
    "Authentication-Token": authToken,
    // "Authentication-Token":
    //   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxOCIsImlhdCI6MTY1OTA5NDkxMiwiZXhwIjoxNjc3MDk0OTEyfQ.WwSyLTd1FQYJs5u4jEFl0U6ayn6g5Wlx-mOgNfthAog",
    "Access-Control-Allow-Origin": "*",
  };
  return headers;
}

export const Client = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
  fetchOptions: {
    mode: "no-cors",
  },
  headers: Config,
});

export default Config;
