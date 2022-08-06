import './App.css';
import { useState, useRef } from 'react';
import axios from "axios";

function App() {
  const [inputAmount, setInputAmount] = useState(null);

  //storing state of the application - fetching information or not
  const [loading, setLoading] = useState(false);

  const host = "https://analytics.fluidefi.com/" //please use your custom URL if you have one

  //url for the gas_price endpoint
  const url = host + "get_amount_in/";

  //jwt token recieved from authorization endpoint
  const token = "{{token}}";

  const inputTokenRef = useRef(null)

  //implement error handling and update UI accordingly
  const errorHandle = (e) => { console.log(e) };

  //collecting data from input fields and sending it to the api
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();


    //initial result value
    let res = null;

    //header configuration for post call
    const config = {
      headers: {
        Authorization: "Token " + token
      }
    };

    //payload (post body)
    const data = {
      network: e.target.network.value,
      platform: e.target.platform.value,
      amount_out: e.target.amount_out.value,
      path: [e.target.input_token.value, e.target.output_token.value],
    };

    //make api call to retrieve average gas prices from the latest
    //block for EIP - 1559 or legacy evm networks
    try {
      res = await axios.post(url, data, config);

      console.log(res);

      //successfuly retrieved data, setting amount_in variable to display in the frontend
      setInputAmount(res.data.amount_in);

      setLoading(false);
    } catch (e) {
      //error handling
      errorHandle(e);
      setLoading(false);
    }



  }
  return (
    <div className="App">
      <h1>Amount In</h1>
      <p>Get a quote for a given output amount and swap path from a uniswapv2-compatible router</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="network">network: </label>
        <select id="network" name="network">
          <option value="mainnet">mainnet</option>
          <option value="ropsten">ropsten</option>
        </select>
        <br />
        <label htmlFor="platform">platform: </label>
        <select id="platform" name="platform">
          <option value="uniswapv2">uniswapv2</option>
          <option value="sushiswap">sushiswap</option>
        </select>
        <br />
        <label htmlFor="input_token">input token: </label>
        <select id="input_token" name="input_token" ref={inputTokenRef}>
          <option value="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48">USDC</option>
          <option value="0xdAC17F958D2ee523a2206206994597C13D831ec7">USDT</option>
          <option value="0x4Fabb145d64652a948d72533023f6E7A623C7C53">BUSD</option>
        </select>
        <br />
        <label htmlFor="output_token">output token: </label>
        <select id="output_token" name="output_token">
          <option value="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48">USDC</option>
          <option value="0xdAC17F958D2ee523a2206206994597C13D831ec7">USDT</option>
          <option value="0x4Fabb145d64652a948d72533023f6E7A623C7C53">BUSD</option>
        </select>
        <br />
        <label htmlFor="amount_out">amount out: </label>
        {/* giving a default value for demonstration purposes  */}
        <input id='amount_out' name='amount_out' placeholder='Enter the desired amount out after swap' defaultValue={100000000000000000000} />
        <br></br>
        {loading ? <b>loading</b> : <input type="submit"></input>}

      </form>

      <p>estimated amount required to recieve the desired output amount: <b>{inputAmount}</b> {inputTokenRef.current?.options[inputTokenRef.current.selectedIndex].text}</p>
    </div>
  );
}

export default App;