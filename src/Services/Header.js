import React from "react";

function Header(userId, token) {
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

export default Header;
