import React from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Image from 'next/image';
import { useApi } from '../hooks/use-api';
import { Loading } from '../components/loading';
import { Error } from '../components/error';

const FAUCET_API = process.env.FAUCET_API || 'http://localhost:8080';
const AUDIENCE = process.env.NEXT_PUBLIC_AUDIENCE
const SCOPE = ''

const Users = () => {
  const { loading, error, data: users = [] } = useApi(
    `${FAUCET_API}/users`, {
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
          <th scope="col"></th>
          <th scope="col">Username</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Created</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {users.map(({ picture, nickname, name, email, createdAt }, i) => (
          <tr key={i}>
            <td>
              <a
                href={`https://github.com/${nickname}`}
                className=""
                target="_blank"
                rel="noreferrer"
              ><Image src={picture} alt="Profile picture" width="50" height="50" /></a>
            </td>
            <td>{nickname}</td>
            <td>{name}</td>
            <td>{email}</td>
            <td>{createdAt}</td>
            <td>
              <a
                href={`https://github.com/${nickname}`}
                className=""
                target="_blank"
                rel="noreferrer"
              >Github</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default withAuthenticationRequired(Users);
