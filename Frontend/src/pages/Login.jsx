import LoginForm from '../components/LoginForm/LoginForm'
import LoginHeader from '../components/Loginheader/LoginHeader'
import './css/login.css'


const Login = () => {
  return (
    <div className='login-container'>
      <LoginHeader/>
      <LoginForm/>
    </div>
  )
}

export default Login
