import { useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Image from 'next/image';
import { useApi } from '../hooks/use-api';
import { callApi } from '../utils'
import { Loading } from '../components/loading';
import { Error } from '../components/error';

const FAUCET_API = process.env.FAUCET_API || 'http://localhost:8080';
const AUDIENCE = process.env.NEXT_PUBLIC_AUDIENCE
const SCOPE = ''

const BlockedAddresses = () => {
  const { getAccessTokenSilently } = useAuth0();

  const [state, setState] = useState({
    error: null,
    loading: false,
    lastUpdated: null,
  });

  const { loading, error, data: blockedAddresses = [] } = useApi(
    `${FAUCET_API}/blocked-addresses`, {
      audience: AUDIENCE,
      scope: SCOPE,
      headers: {
        'Content-Type': 'application/json'
      }
    }, state.lastUpdated);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  const blockAddress = async event => {
    event.preventDefault()

    const address = event.target.address.value;

    if(!address) return;

    setState({
      loading: true,
    });

    const accessToken = await getAccessTokenSilently({ AUDIENCE, SCOPE });
    const { error, data, txURL } = await callApi(
      `${FAUCET_API}/blocked-addresses`,
      accessToken,
      {
        body: JSON.stringify({
          address: address
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    setState({
      error,
      loading: false,
      lastUpdated: !error && Date.now()
    });
  }

  const unblockAddress = async (id) => {
    event.preventDefault()

    if(!id) return;

    setState({
      loading: true,
    });

    const accessToken = await getAccessTokenSilently({ AUDIENCE, SCOPE });
    const { error } = await callApi(
      `${FAUCET_API}/blocked-addresses/${id}`,
      accessToken,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'DELETE'
      })
    console.log(error)
    setState({
      error,
      loading: false,
      lastUpdated: !error && Date.now()
    });
  }

  return (
    <div>
      <form onSubmit={blockAddress}>
        <label htmlFor="address" className="sr-only">Address</label>
        <input id="address" type="text" className="form-control mb-2" placeholder="Enter address to block" required />
        <button className="btn btn-lg btn-primary btn-block" type="submit">Block</button>
      </form>
      <hr />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Address</th>
            <th scope="col">Created</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {blockedAddresses.map(({ id, address, createdAt }, i) => (
            <tr key={i}>
              <td>{address}</td>
              <td>{createdAt}</td>
              <td>
                <button onClick={unblockAddress.bind(this, id)} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default withAuthenticationRequired(BlockedAddresses);
