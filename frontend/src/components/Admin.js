import React, { useState } from "react";
import { useConfig } from "../context/ConfigContext";

function Admin() {
  const config = useConfig();

  let runMatches = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      console.log(response);
    } catch (error) {}
  };

  return <button onClick={runMatches}>Match</button>;
}

export default Admin;
