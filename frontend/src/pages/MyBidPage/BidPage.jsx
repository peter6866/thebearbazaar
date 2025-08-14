import React, { useState } from "react";
import ViewBid from "./ViewBid";
import ViewMatched from "./ViewMatched";
import Transact from "./Transact";
import { useAuth } from "../../context/AuthContext";
import { useSelector } from "react-redux";
import {
  selectHasBid,
  selectIsMatched,
  selectLoading,
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
import { Snackbar, Alert, Container } from "@mui/material";

function BidPage() {
  const { authToken } = useAuth();

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

  const [cancelSnackbarOpen, setCancelSnackbarOpen] = useState(false);
  const [cancelSnackbarMessage, setCancelSnackbarMessage] = useState("");

  const handleCancelSnackbarClose = () => {
    setCancelSnackbarOpen(false);
  };

  const cancelBid = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/bids`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        dispatch(setHasBid(false));
        setCancelSnackbarMessage("Bid canceled successfully");
        setCancelSnackbarOpen(true);
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/v1/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          type: transType,
          price: bidData["Price"],
        }),
      });

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
        `${import.meta.env.VITE_API_URL}/v1/match/current`,
        {
          method: "DELETE",
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
    <Container>
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
      <Snackbar
        open={cancelSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleCancelSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCancelSnackbarClose} severity="success">
          {cancelSnackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default BidPage;
