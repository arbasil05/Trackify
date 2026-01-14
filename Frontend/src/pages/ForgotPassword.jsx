import LoginLeft from "../components/login-left/LoginLeft"
import ForgotPassword from "../components/forgot-password/ForgotPassword"
import "./ForgotPassword.css"

const ForgotPasswordPage = () => {
    return (
        <div className="forgotpassword-page">
            <LoginLeft />
            <ForgotPassword />
        </div>
    )
}

export default ForgotPasswordPage
