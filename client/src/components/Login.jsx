import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import AuthContract from '../contracts/Auth.json';
import './Login.css';
import Navbar from './navele';
import SellerContract from '../contracts/Seller.json';
import Cookies from 'js-cookie';
import Seller from './Seller';
import { login } from '../features/userSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [privateNumber, setPrivateNumber] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hashedPassword,setHashedPassword] = useState('');
  const [hashedPrivateNumber,setHashedPrivateNumber] = useState('');
  const [sellers,setSellers] = useState(false);

  useEffect(() => {
    const loggedInStatus = Cookies.get("username");
    if (loggedInStatus) {
      setLoggedIn(true);
    }
  }, []);

  const dispatch = useDispatch();
  dispatch(login({
    username:username
  }));
  
  console.log(username);
  console.log(hashedPassword,hashedPrivateNumber);
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
    
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const abi = AuthContract.abi;
      const contract = new web3.eth.Contract(abi,'0xd90f31aFd6bBF454A8ee573d4067Dc22BDec4759');  
      const hashedPass = web3.utils.keccak256(password);
      const hashedPrivateNum = web3.utils.keccak256(privateNumber);
      const result = await contract.methods.login(username, hashedPass,hashedPrivateNum ).call();
      const loginTime = new Date().toLocaleTimeString();
      if ( result ) {
        Cookies.set("username", username,{ expires: 1 });
        Cookies.set("time",loginTime);
        setLoggedIn(true);
      } else {
        setErrorMessage('Invalid credentials');
        alert('Invalid Credentials');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.log(error.message);
    }
  };

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const abi = AuthContract.abi;
      const contract = new web3.eth.Contract(abi,'0xd90f31aFd6bBF454A8ee573d4067Dc22BDec4759');  

      const hashedPassword = web3.utils.keccak256(password);
      const hashedPrivateNumber = web3.utils.keccak256(privateNumber);
      setHashedPassword(hashedPassword);
      setHashedPrivateNumber(hashedPrivateNumber);
      await contract.methods.register(username, hashedPassword, hashedPrivateNumber).send({ from: '0x5BD00ebD9881e6946af29F89218a510AB42EdFBb' });

      setLoggedIn(false);
      e.preventDefault();
      setUsername('');
      setPassword('');
      setPrivateNumber('');
      
    } catch (error) {
      setErrorMessage(error.message);
      console.log(errorMessage);
    }
  };

  const sellerhandle = async(e) => {
    e.preventDefault();
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const abi = SellerContract.abi;
      const contract = new web3.eth.Contract(abi,"0xa70F130285861D1E543e0CD0dd5503E77D13b9C4");
      const acc = await web3.eth.getAccounts();

      const a = await contract.methods.login(acc[0]).call();
      if(a){
        Cookies.set("sellers","true");
        setSellers(true);
        setLoggedIn(true);
      } else {
        alert('You are not a seller!!')
      }
    } catch(err) {
      console.log(err);
    }
  };
  
  if (loggedIn) {
    if (sellers){
      return (
        <div> 
          <Seller />
        </div>
      );
    } else {
      return (
        <div>
          <Navbar />
        </div>
      );
    }
  } else {
    return (
      <div className='auth-form-container'>
        <form className='login-form'>
          <h1>Login/Register</h1>
          <div>
            <label id='usrname'>Username:</label>
            <input id='username' type="text" value={username} onChange={(e) => setUsername(e.target.value)}  autoComplete="off" />
          </div>
          <div>
            <label id='usrname'>Password:</label>
            <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)}  autoComplete="off"/>
          </div>
          <div>
            <label id='usrname'>Private Number:</label>
            <input id='private' type="number" value={privateNumber} onChange={(e) => setPrivateNumber(e.target.value)}  autoComplete="off" />
          </div>
          {errorMessage && <div>{errorMessage}</div>}
          <div id='buttons'>
            <button id='btn' className='b1' type="submit" onClick={handleLogin}>Login</button>
            <button id='btn' className='b2' type="submit" onClick={handleRegister}>Register</button>
            <div >
              <button id='sellerbtn'  type='submit' onClick={sellerhandle}>Login as Seller</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
