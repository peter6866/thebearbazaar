import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';






function SignUp() {

    const [userData, setUserData] = useState({
        email: "",
        password: "",
        code: ""
      });

      const [successMessage, setSuccessMessage] = useState("")
      const [errorMessage, setErrorMessage] = useState("")




    let requestCode = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/v1/users/get-code', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({"email": userData["email"]})
            });
      
            if (!response.ok) {
              const error = await response.json();
              setErrorMessage(error.message)
            }
            else {
                console.log("Code Sent")
            }
      
            setUserData({
              email: userData["email"],
              password: "",
              code: ""
            });
          } catch (error) {} 
    }

    let update = (e) => {
        const {name, value} = e.target;
        setUserData({...userData, [name]: value})


    }



    return (
        <div className="auth-container-inner">
            <h3>Sign Up</h3>
            <form onSubmit={requestCode}>
                <div><TextField fullWidth id="email" name="email" value={userData["email"]} label="email@wustl.edu" variant="standard" onChange={update} /></div>
                <div><Button onClick={requestCode} variant="contained">Get One Time Code</Button></div>
                {errorMessage && <div><Alert severity="error">{errorMessage}</Alert></div>}
            </form>
        </div>

    )
}

export default SignUp

