import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import { useAuth } from "../context/AuthContext";
import { useConfig } from "../context/ConfigContext";

function Transact(){
    const [bidData, setBidData] = useState({
        Price: -1,
    });

    const [transType, setTransType] = useState("buy");
    const [errorMessage, setErrorMessage] = useState("");
    const config = useConfig();
    //const { bid } = useAuth();
    let update = (e) => {
        const { name, value } = e.target;
        setBidData({ ...bidData, [name]: value });
      };
    
    let sendBid = async (e) =>{
        e.preventDefault();
        //alert(bid);
        try {
        const response = await fetch(
            `${config.REACT_APP_API_URL}/v1/bids/${transType}-bid`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                //"Authorization": `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                price: bidData["price"],
            }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.message);
        } 
        } catch (error) {}
        
    }


    return(
        <form>
           Would you like to buy or sell mealpoints?
           <br/>
          <input type="radio" id="Buy" checked={transType == "buy"} onChange={() => setTransType("buy")} name="Transact" value="Buy" required="required"/>
          <label for="Buy">Buy</label> 
          <input type="radio" id="Sell" checked={transType == "sell"} onChange={() => setTransType("sell")} name = "Transact" value="Sell" required="required"/>
          <label for="Sell">Sell</label> 
        <br/>
        <label for="Price"> Willingness to pay: $ </label>
        <input type="number" id="Price" name="Price"  onChange={update} min="0" max = "500" required />
        <input type = "submit" value = "Submit" onClick={sendBid} />
        {errorMessage && (
          <div>
            <Alert severity="error">{errorMessage}</Alert>
          </div>
        )}
          </form>
    );
}

export default Transact;