import React, { useEffect, useState } from 'react';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
import Web3 from 'web3';

const SellerDash = () => {
  const [counter,setCounter] = useState(0);
  const items = async() => {
    //e.preventDefault();
    try{
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x2EcE9C3125a99C31258Fc7b22E9CCC3808B0711D");
        await contract.methods.counter().call()
        .then(result => {
          setCounter(result);
          console.log(result);
        })
       
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {
    items();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div>
      <h1>Number of Items Sold :</h1>
      <h1>{counter}</h1>
    </div>
  )
}

export default SellerDash
