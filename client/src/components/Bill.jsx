import React, {useState} from 'react'
import Web3 from 'web3';
import Cookies from 'js-cookie';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
const Bill = () => {

    const [sname,setsname] = useState('');
    const [pname,setpname] = useState('');
    const [date,setDate] = useState('');
    const [price,setPrice] = useState();
    const [email,setEmail] = useState('');
    let uniqueId;
  const submit = async(e) => {
    e.preventDefault();
    try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x2EcE9C3125a99C31258Fc7b22E9CCC3808B0711D");
        //const acc = await web3.eth.getAccounts();
        await contract.methods.purchase(sname,pname,date,price)
        .send({from:"0x1D136552909abe8736a900a4C4b2Cd9617D2e4C6"})
        .on('receipt', (receipt) => {
          const productId = receipt.events.PurchaseSuccessful.returnValues.productId;
          console.log(`Purchase successful. Product ID: ${productId}`);
          uniqueId = productId;
        });

        //console.log(uniqueId);
        const sub = "Your_Purchase_ID";
        const message = `Hello ${sname}, your purchase id is ${uniqueId}, price of your product is ${price} (!!WARNING: DONT SHARE IT WITH ANYONE) `;
        const mailtoLink = `mailto:${email}?subject=${sub}&body=${message}`;
        window.location.href = mailtoLink;
        if(uniqueId){
          Cookies.set("sellers","true");
        setsname('');
        setDate('');
        setpname('');
        setPrice('')
        setEmail('');
        // window.location.href = '/';
       
        //console.log(b);
        }
        
    }catch(err){
        console.log(err)
    }
    
  };

 

  return (
    <div>
       <form id='sellergooddiv' onSubmit={submit}>
                <h1>Enter Consumer Product Details :</h1>
                <label id='l1'>Seller Name :</label>
                <input type='text' id='sellerSeller' name='user_name' onChange={(e) => setsname(e.target.value)} autoComplete='off' required></input>
                <label id='l1'>Purchaser Name :</label>
                <input type='text' id='sellerPurchaser' onChange={(e) => setpname(e.target.value)} autoComplete='off' required></input>
                <label id='l1'>Date :</label>
                <label></label>
                <input type='date' id='sellerdate' onChange={(e) => setDate(e.target.value)} autoComplete='off' required></input>
                <label id='l1'>Price :</label>
                <input type='number' min={0} id='sellerprice' name='message' onChange={(e) => setPrice(e.target.value)} autoComplete='off' required></input>
                <label id='l1'>Email :</label>
                <input type="email"  name='user_email' onChange={(e) => setEmail(e.target.value)} autoComplete='off' required />
                <button type='submit' id='send' >Send</button>
                
                </form>
    </div>
  )
}

export default Bill
