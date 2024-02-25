import React, { useState, useEffect } from "react";
import { useConfig } from "../context/ConfigContext";
import QAPair from "./QAPair";

function Faq() {
  const [questionsData, setQuestionsData] = useState([]);
  const config = useConfig();

  let loadFAQ = async () => {
    if (!config || !config.REACT_APP_API_URL) {
      return;
    }

    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/faq/get-faq`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("ERROR");
        return;
      } else {
        setQuestionsData(data.questions);
      }
    } catch (error) {}
  };

  useEffect(() => {
    loadFAQ();
  }, [config]);

  return (
    <div>
      <h3>Frequently Asked Questions</h3>
      {questionsData.map((item, index) => (
        <QAPair
          key={index}
          data={{
            question: item.question,
            answer: item.answer,
          }}
        />
      ))}
    </div>
  );
}

export default Faq;
