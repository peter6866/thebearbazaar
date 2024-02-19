import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
function SignUp() {
    return (
        <div>
            <h2>Sign Up</h2>
            <form>
                <TextField fullWidth id="standard-basic" label="email@wustl.edu" variant="standard" />
                <Button variant="contained">Get One Time Code</Button>
            </form>
        </div>

    )
}

export default SignUp

