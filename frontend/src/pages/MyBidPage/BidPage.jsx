import React, { useState, useEffect, useCallback } from "react";
import ViewBid from "./ViewBid";
import ViewMatched from "./ViewMatched";
import Transact from "./Transact";
import { useAuth } from "../../context/AuthContext";
import { useConfig } from "../../context/ConfigContext";

function BidPage() {
  const { authToken } = useAuth();
  const config = useConfig();

  //variable used to hide bid placement while fetching data
  const [loadingBid, setLoadingBid] = useState(true);
  const [loadingMatch, setLoadingMatch] = useState(true);

  //the variables when already bid
  const [bidType, setBidType] = useState("");
  const [bidPrice, setBidPrice] = useState(0);
  const [hasBid, setHasBid] = useState(false);

  //the vairables when making a bid
  const [transType, setTransType] = useState("Buy");
  const [errorMessage, setErrorMessage] = useState("");
  const [bidData, setBidData] = useState({
    Price: 250,
  });

  //the variables when matched
  const [isMatched, setIsMatched] = useState(false);
  const [matchedType, setMatchedType] = useState("");
  const [matchedEmail, setmatchedEmail] = useState("");
  const [matchedPhone, setMatchedPhone] = useState("");
  const [matchedPrice, setMatchedPrice] = useState(0);

  const fetchMatched = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/match-info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data) {
        setIsMatched(true);
        const { matchedType, email, phoneNum, price } = data.data.matchDetails;
        setMatchedType(matchedType);
        setmatchedEmail(email);
        setMatchedPhone(phoneNum);
        setMatchedPrice(price);
        setLoadingMatch(false);
      } else {
        setIsMatched(false);
        setLoadingMatch(false);
      }
    } catch (error) {
      setIsMatched(false);
      setLoadingMatch(false);
    }
  }, [authToken, config]);

  const fetchBid = useCallback(async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/get-bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data) {
        setBidType(data.trans);
        setBidPrice(data.price);
        setHasBid(true);
        setLoadingBid(false);
      } else {
        setHasBid(false);
        setLoadingBid(false);
      }
    } catch (error) {
      setHasBid(false);
      setLoadingBid(false);
    }
  }, [authToken, config]);

  const cancelBid = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/cancel-bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            type: matchedType,
          }),
        }
      );

      if (response.ok) {
        setHasBid(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchBid();
    fetchMatched();
  }, [fetchBid, fetchMatched]);

  let update = (e) => {
    const { name, value } = e.target;
    setBidData({ ...bidData, [name]: value });
  };

  let sendBid = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/bids/${transType}-bid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            price: bidData["Price"],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message);
      } else {
        setBidType(transType);
        setBidPrice(bidData["Price"]);
        setHasBid(true);
      }
    } catch (error) {}
  };

  const cancelTrans = async () => {
    try {
      const response = await fetch(
        `${config.REACT_APP_API_URL}/v1/match/cancel-trans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            type: matchedType,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.log("Error canceling transaction");
      } else {
        setHasBid(false);
        setIsMatched(false);
      }
    } catch (error) {}
  };

  return (
    <div>
      {!hasBid && !isMatched && !loadingMatch && !loadingBid && (
        <Transact
          sendBid={sendBid}
          transType={transType}
          setTransType={setTransType}
          bidData={bidData}
          update={update}
          errorMessage={errorMessage}
        />
      )}
      {hasBid && !isMatched && (
        <ViewBid bidType={bidType} bidPrice={bidPrice} cancelBid={cancelBid} />
      )}
      {isMatched && !hasBid && (
        <div>
          <ViewMatched
            matchedEmail={matchedEmail}
            matchedPhone={matchedPhone}
            matchedType={matchedType}
            matchedPrice={matchedPrice}
            cancelTrans={cancelTrans}
          />
        </div>
      )}
    </div>
  );
}

export default BidPage;
