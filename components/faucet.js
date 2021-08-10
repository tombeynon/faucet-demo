import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Countdown from 'react-countdown';
import { Loading } from '../components/loading';
import { Error } from '../components/error';
import { useApi } from '../hooks/use-api';
import { callApi } from '../utils'

const FAUCET_API = process.env.FAUCET_API || 'http://localhost:8080';
const AUDIENCE = process.env.NEXT_PUBLIC_AUDIENCE
const SCOPE = ''

export function Faucet() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently } = useAuth0();

  const [state, setState] = useState({
    error: null,
    loading: false,
    data: null,
    txURL: null,
    lastFunded: null
  });

  const { loading, error, data } = useApi(
    `${FAUCET_API}`, {
      audience: process.env.NEXT_PUBLIC_AUDIENCE,
      scope: '',
      headers: {
        'Content-Type': 'application/json'
      }
    }, state.lastFunded
  );

  if (error) {
    var message = `Faucet is down: ${error}`
    return <Error message={message} />;
  }

  var unlockDate
  if(data){
    var {unlockDate} = data
    unlockDate = Date.parse(unlockDate)
  }

  const requestFunds = async event => {
    event.preventDefault()

    setState({
      loading: true,
    });

    const accessToken = await getAccessTokenSilently({ AUDIENCE, SCOPE });
    const { error, data, txURL } = await callApi(
      `${FAUCET_API}/faucet`,
      accessToken,
      {
        body: JSON.stringify({
          address: event.target.address.value
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    setState({
      data,
      error,
      loading: false,
      txURL: data.transactionHash && `https://www.mintscan.io/akash/txs/${data.transactionHash}`,
      lastFunded: !error && Date.now()
    });
  }

  if (state.loading) {
    return <Loading />;
  }

  if (state.error) {
    return (
      <Error message={state.error.message} />
    )
  }

  const reload = () => {
    setState({
      error: null,
      loading: false,
      data: null,
      txURL: null
    })
  }

  const renderFaucet = function() {
    return (
      <div>
        {state.txURL ? (
          <div>
            <p className="text-center">Funds sent</p>
            <p><a href={state.txURL} target="_blank" rel="noreferrer" className="btn btn-primary btn-large btn-block">View TX</a></p>
            <p><button onClick={reload} className="btn btn-block btn-large">Back</button></p>
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

  return (
    <div>
      {!state.txURL && unlockDate && unlockDate > Date.now() ? (
        <div className="text-center">
          <Countdown date={unlockDate}>
            {renderFaucet()}
          </Countdown>
        </div>
      ) : (
        <div>
          {renderFaucet()}
        </div>
      )}
    </div>
  )
}
