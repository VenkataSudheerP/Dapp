import React, { useState } from 'react';
import Web3 from 'web3';
import SellerContractGoods from '../contracts/SellerContractGoods.json';
import './Blocka.css';

const Blocka = () => {
    const [input, setInput] = useState('');

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const blocked = async (e) => {
        e.preventDefault();
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x2EcE9C3125a99C31258Fc7b22E9CCC3808B0711D");
        console.log(input);
        await contract.methods.blockProduct(input)
            .send({ from: '0x5BD00ebD9881e6946af29F89218a510AB42EdFBb'}) // replace with your own account address
        
    };

    const unblock = async (e) => {
        e.preventDefault();
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const abi = SellerContractGoods.abi;
        const contract = new web3.eth.Contract(abi,"0x2EcE9C3125a99C31258Fc7b22E9CCC3808B0711D");
        await contract.methods.unblockProduct(input)
            .send({ from: '0x5BD00ebD9881e6946af29F89218a510AB42EdFBb', gas: 1000000 }) // replace with your own account address
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.error(error);
            });
        
    };

    return (
        <div>
            <label className='title'>Block/UnBlock :</label>
            <input type='text' id='blockid' value={input} onChange={handleInputChange}></input>
            <div id='blockbtn'>
                <button id='btn' className='blk1' onClick={blocked}>Block</button>
                <button id='btn' className='blk2' onClick={unblock}>UnBlock</button>
            </div>
        </div>
    )
}

export default Blocka;
