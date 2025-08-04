import LoginLeft from "../components/login-left/LoginLeft"
import SignUpRight from "../components/signupright/SignUpRight"

const SignUp = () => {
  return (
    <div style={{display:"flex"}}>
      <LoginLeft/>
      <SignUpRight/>
    </div>
  )
}

export default SignUp
