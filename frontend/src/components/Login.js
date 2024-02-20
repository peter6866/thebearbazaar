import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';






function Login({flip}) {

    const [userData, setUserData] = useState({
        email: "",
        password: "",
      });

    const [errorMessage, setErrorMessage] = useState("");


    let update = (e) => {
      const {name, value} = e.target;
      setUserData({...userData, [name]: value})
    }

    let submitLogin = async (e) => {
      e.preventDefault();

      try {
          const response = await fetch('http://localhost:3001/api/v1/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "email": userData["email"],
              "password": userData["password"]
          })
          });
          
          if (!response.ok) {
            setErrorMessage("Invalid Email or Password")
          }
          else {
            console.log("Logged In");
              
          }
        } catch (error) {} 
  }

    return (
        <div className="auth-container-inner">
          <h3>Login</h3>

            
          <form onSubmit={submitLogin}>
              <div><TextField fullWidth id="email" name="email" value={userData["email"]} label="email@wustl.edu" variant="standard" onChange={update} /></div>
              <div><TextField fullWidth type="password" id="password" name="password" value={userData["password"]} label="Password" variant="standard" onChange={update} /></div>
              <div><Button onClick={submitLogin} variant="contained">Login</Button></div>
              {errorMessage && <div><Alert severity="error">{errorMessage}</Alert></div>}
          </form>

          <div onClick={flip}>Need an account? Sign up.</div>
        </div>

    )
}

export default Login

