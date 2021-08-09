import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApi } from '../hooks/use-api';
import { Loading } from '../components/loading';
import { Error } from '../components/error';

const FAUCET_API = process.env.FAUCET_API || 'http://localhost:8080';

export function Faucet(props) {
  const { loading, error, data } = useApi(
    `${FAUCET_API}/faucet`,
    {
      audience: process.env.NEXT_PUBLIC_AUDIENCE,
      scope: '',
      body: JSON.stringify({
        address: props.address
      }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    }
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error message={error.message} />
    )
  }

  const txURL = `https://www.mintscan.io/akash/txs/${data.transactionHash}`

  return (
    <div>
      <p className="text-center">Funds sent</p>
      <p><a href={txURL} target="_blank" rel="noreferrer" className="btn btn-primary btn-large btn-block">View TX</a></p>
    </div>
  );
};
