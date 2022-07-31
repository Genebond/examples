import { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

export default function App() {
  //store gas price as well as other information provided in state
  const [gasPrice, setGasPrice] = useState(0);
  const [chainId, setChainId] = useState(0);
  const [blockNumber, setBlockNumber] = useState(0);
  const [min_base_fee_per_gas, set_min_base_fee_per_gas] = useState(0);
  const [max_base_fee_per_gas, set_max_base_fee_per_gas] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error_message, set_error_message] = useState(null);

  //storing state of the application - fetching information or not
  const [loading, setLoading] = useState(false);

  const host = "https://qaapius01.fluidefi.io/"

  //url for the gas_price endpoint
  const url = host + "gas_price/";

  //jwt token recieved from authorization endpoint
  const token = "ac7e1c4a7665afa9b01c0f0b8a0a38f6bbb85573";

  //implement error handling and update UI accordingly
  const errorHandle = (e) => { };

  //fetch gas_price after the initial render
  useEffect(() => {
    //calls the gas_price api initially and continues to call 
    //and update the gas price every 30 second. Can be adjusted
    //for more or less frequent calling as required
    getGasAPICall();
    setInterval(getGasAPICall, 30000);
  }, []);

  async function getGasAPICall() {

    console.log("calling api");

    setLoading(true);

    //initial result value
    let res = null;

    //header configuration for post call
    const config = {
      headers: {
        Authorization: "Token " + token
      }
    };

    //payload (post body)
    const data = { network: "mainnet" };

    //make api call to retrieve average gas prices from the latest
    //block for EIP - 1559 or legacy evm networks
    try {
      res = await axios.post(url, data, config);
    } catch (e) {
      console.log(e);
      //error handling
      errorHandle(e);
    }

    //successfully retrieved gas_price; update UI accordingly

    let temp = null;

    //gas_price always null for mainnet
    if (res.data.gas_price === null) {
      //set gas price to max base fee + buffer of 5%
      temp = parseInt(res.data.max_base_fee_per_gas * 1.05);
    } else {
      //set gas price to the returned data attribute gas_price
      temp = parseInt(res.data.gas_price);
    }

    //converting the WEI into GWEI
    temp = ethers.utils.formatUnits(temp, "gwei");

    //converting the converted string into float and rounding to two 
    //decimal places (FOR UI PURPOSES)
    temp = parseFloat(temp).toFixed(2);

    //updating the formatted gas price to the state and updating the UI
    setGasPrice(temp);

    //setting other attributes to state
    setChainId(res.data.chain_id);
    setBlockNumber(res.data.block_number);
    set_max_base_fee_per_gas(res.data.max_base_fee_per_gas);
    set_min_base_fee_per_gas(res.data.min_base_fee_per_gas);
    setSuccess(res.data.success);
    set_error_message(res.data.error_message);

    setLoading(false);

  }

  return (
    <div className="App">
      <center>
        <h1>Current Gas price of Etherium (mainnet)</h1>
        <h2>Average Gas Price: {gasPrice} GWEI</h2>
        <p>chain id: {chainId}</p>
        <p>block number: {blockNumber}</p>
        <p>min base fee per gas: {min_base_fee_per_gas} WEI</p>
        <p>max base fee per gas: {max_base_fee_per_gas} WEI</p>
        <p>success: {success.toString()}</p>
        <p>error message: {error_message}</p>
        <button onClick={getGasAPICall}> {loading === false ? "Get Gas Price " : "loading"}</button>
      </center>

    </div>
  );
}
