import React, { useState } from "react";
import ViewBid from "./ViewBid";
import ViewMatched from "./ViewMatched";
import Transact from "./Transact";
import { useAuth } from "../../context/AuthContext";
import { useConfig } from "../../context/ConfigContext";
import { useSelector } from "react-redux";
import {
  selectHasBid,
  selectIsMatched,
  selectLoading,
  selectError,
  selectMatchedType,
  selectMatchedEmail,
  selectMatchedPhone,
  selectMatchedPrice,
  selectBidType,
  selectBidPrice,
  setHasBid,
  setIsMatched,
  setBidType,
  setBidPrice,
} from "../../features/bidSlice";
import { useDispatch } from "react-redux";

function BidPage() {
  const { authToken } = useAuth();
  const { config } = useConfig();

  const dispatch = useDispatch();
  const hasBid = useSelector(selectHasBid);
  const isMatched = useSelector(selectIsMatched);

  //variable used to hide bid placement while fetching data
  const loading = useSelector(selectLoading);

  //the variables when already bid
  const bidType = useSelector(selectBidType);
  const bidPrice = useSelector(selectBidPrice);

  //the vairables when making a bid
  const [transType, setTransType] = useState("Buy");
  const [errorMessage, setErrorMessage] = useState("");
  const [bidData, setBidData] = useState({
    Price: 250,
  });

  //the variables when matched
  const matchedType = useSelector(selectMatchedType);
  const matchedEmail = useSelector(selectMatchedEmail);
  const matchedPhone = useSelector(selectMatchedPhone);
  const matchedPrice = useSelector(selectMatchedPrice);

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
        dispatch(setHasBid(false));
      }
    } catch (error) {}
  };

  let update = (e) => {
    const { name, value } = e.target;
    setBidData({ ...bidData, [name]: value });
  };

  const sendBid = async (e) => {
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
        dispatch(setBidType(transType));
        dispatch(setBidPrice(bidData["Price"]));
        dispatch(setHasBid(true));
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

      if (!response.ok) {
        alert("Error canceling transaction");
      } else {
        dispatch(setHasBid(false));
        dispatch(setIsMatched(false));
      }
    } catch (error) {}
  };

  return (
    <div>
      {!hasBid && !isMatched && !loading && (
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
