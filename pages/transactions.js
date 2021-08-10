import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { useApi } from '../hooks/use-api';
import { Loading } from '../components/loading';
import { Error } from '../components/error';

const FAUCET_API = process.env.FAUCET_API || 'http://localhost:8080';
const AUDIENCE = process.env.NEXT_PUBLIC_AUDIENCE
const SCOPE = ''

const Transactions = () => {
  const { loading, error, data: transactions = [] } = useApi(
    `${FAUCET_API}/transactions`, {
      audience: AUDIENCE,
      scope: SCOPE,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error.message} />;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">User</th>
          <th scope="col">Address</th>
          <th scope="col">Amount</th>
          <th scope="col">Date</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(({ user, address, transactionHash, amountUakt, createdAt }, i) => (
          <tr key={i}>
            <td>
              <a
                href={`https://github.com/${user.nickname}`}
                className=""
                target="_blank"
                rel="noreferrer"
              >{user.nickname}</a>
            </td>
            <td>{address}</td>
            <td>{amountUakt}uakt</td>
            <td>{createdAt}</td>
            <td>
              {transactionHash && (
                <a
                  href={`https://www.mintscan.io/akash/txs/${transactionHash}`}
                  className=""
                  target="_blank"
                  rel="noreferrer"
                >View</a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default withAuthenticationRequired(Transactions);
