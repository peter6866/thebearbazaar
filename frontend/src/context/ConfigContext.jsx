import React, { createContext, useContext, useState, useEffect } from "react";

const ConfigContext = createContext();

export function useConfig() {
  return useContext(ConfigContext);
}

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/config.json")
      .then((response) => response.json())
      .then((config) => {
        setConfig(config);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};
