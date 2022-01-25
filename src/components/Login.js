import React, {useState, useContext, useEffect} from 'react';
import { Row, Col, Alert, Container } from "reactstrap"
import { Link, useHistory } from "react-router-dom"

import { AuthContext } from '../context/AuthState';

const Login = (props) => {
  const userData = useContext(AuthContext);
  const {login} = useContext(AuthContext);
  const history = useHistory();

  const [userLog, setuserLog] = useState({
      email: '',
      password: ''
  })

  const userLogin = () => {
      login({
          password: userLog.password,
          email: userLog.email
      })
  };

  const updateField = e => {
      setuserLog({
          ...userLog,
          [e.target.name]: e.target.value
      });
  };

  useEffect(() => {
    if(userData.auth.isAuthenticated || localStorage.getItem('user')){
      if(userData.auth.user){
          history.push('/');
      }
    }
  }, [userData.auth.isAuthenticated]);

  return (
    <React.Fragment>


  <div className="wrapper fadeInDown">
    <div id="formContent">

    <div className="fadeIn first imgContainer">
        <img src="images/kimbocorp.png" id="icon" alt="User Icon" />
      </div>
      <form>
        <input type="email" id="email" className="fadeIn second" name="email" placeholder="Type your Email" onChange={updateField}/>
        <input type="password" id="password" className="fadeIn third" name="password" placeholder="Type your Password" onChange={updateField}/>
        <input type="button" onClick={() => userLogin()} className="fadeIn fourth" value="Log In"/>
      </form>


    </div>
  </div>
    </React.Fragment>
  )
}


export default Login;