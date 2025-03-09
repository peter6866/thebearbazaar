import React from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useConfig } from "../context/ConfigContext";

const TurnstileWidget = ({ onSuccess, onError, onExpire }) => {
  const { config } = useConfig();

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Turnstile
        siteKey={config.REACT_APP_TURNSTILE_SITE_KEY}
        onSuccess={onSuccess}
        onError={onError || (() => {})}
        onExpire={onExpire || (() => {})}
      />
    </div>
  );
};

export default TurnstileWidget;
