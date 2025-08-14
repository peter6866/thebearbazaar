import React from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const TurnstileWidget = ({ onSuccess, onError, onExpire }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Turnstile
        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
        onSuccess={onSuccess}
        onError={onError || (() => {})}
        onExpire={onExpire || (() => {})}
      />
    </div>
  );
};

export default TurnstileWidget;
