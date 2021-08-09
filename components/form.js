import { useState } from 'react';
import { Faucet } from '../components/faucet';

export function Form() {

  const [address, setAddress] = useState();

  const requestFunds = event => {
    event.preventDefault()
    setAddress(event.target.address.value)
  }

  const clearAddress = () => {
    setAddress()
  }

  return (
    <div>

      {address ? (
        <div>
          <Faucet address={address} />
          <p><button onClick={clearAddress} className="btn btn-block btn-large">Back</button></p>
        </div>
      ) : (
        <form onSubmit={requestFunds}>
          <label htmlFor="address" className="sr-only">Address</label>
          <input id="address" type="text" className="form-control mb-2" placeholder="Enter your address" required />
          <button className="btn btn-lg btn-primary btn-block" type="submit">Fund me</button>
        </form>
      )}
    </div>
  )
}