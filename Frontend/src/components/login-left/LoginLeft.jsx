import "./LoginLeft.css"
const LoginLeft = () => {
  return (
    <div className="loginleft-container">
        <div className="loginleft-title">
            <h1>Trac<span className="loginleft-title-span">kify</span></h1>
            <h3>Welcome to Trackify</h3>
            <p>Your Smart Student Dashboard</p>
        </div>
        <div className="loginleft-image">
            <img src="/login-image.png" alt="" />
        </div>
        <div className="loginleft-footer">
            <h3>One place to view your academic journey</h3>
            <p>Track your credits, monitor your cgpa <br /> plan your semester</p>
        </div>
      
    </div>
  )
}

export default LoginLeft
