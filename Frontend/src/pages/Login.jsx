import LoginLeft from "../components/login-left/LoginLeft"
import LoginRight from "../components/login-right/LoginRight"
import "./Login.css"

const Login = () => {
  return (
    <div className="login-page">
      <LoginLeft/>
      <LoginRight/>
    </div>
  )
}

export default Login
