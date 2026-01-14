import LoginLeft from "../components/login-left/LoginLeft"
import SignUpRight from "../components/signupright/SignUpRight"
import "./SignUp.css"

const SignUp = () => {
  return (
    <div className="signup-page">
      <LoginLeft/>
      <SignUpRight/>
    </div>
  )
}

export default SignUp
