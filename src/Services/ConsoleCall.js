import React from "react";
import { useEffect } from "react";

function ConsoleCall(boolean, string, endResult) {
  let output;
  if (boolean) return (output = console.log(string, endResult));

  return output;
}

export default ConsoleCall;
