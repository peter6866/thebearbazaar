import React, { useEffect } from "react";
import QAPair from "./QAPair";

function Faq() {
  return (
    <div className="container-outer">
      <div className="container-inner">
        <h3>Frequently Asked Questions</h3>
        <QAPair
          data={{
            question: "Where do I go to buy meal points?",
            answer: "You go to the transact page.",
          }}
        />
        <QAPair
          data={{
            question: "How many meal points can I buy?",
            answer:
              "You can only buy or sell 500 meal points, once per semester.",
          }}
        />
      </div>
    </div>
  );
}

export default Faq;
