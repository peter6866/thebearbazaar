import '../styles/Auth.css'
import React, { useState } from "react";
import SignUp from './SignUp'
import Login from './Login'

function Auth() {

    const [loginStep, setLoginStep] = useState(true);

    let flip = () => {
        setLoginStep(!loginStep);
    }

    return (
        
        <div className="auth-container-outer">
            <h1>The Bear Bazaar</h1>
            {loginStep && <Login flip={flip} />}
            {!loginStep && <SignUp flip={flip} />}
        </div>
    )

}

export default Auth