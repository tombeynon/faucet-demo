import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { Loading } from '../components/loading';
import { Error } from '../components/error';
import { Faucet } from '../components/faucet';

export default function Home() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect
  } = useAuth0();
  const { pathname } = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>

      {isAuthenticated ? (
        <div>
          <p className="text-center">Hello, {user.nickname}</p>{' '}
          <Faucet />
        </div>
      ) : (
        <button
          className="btn btn-outline-success btn-large btn-block"
          id="login"
          onClick={() => loginWithRedirect()}
        >
          Login
        </button>
      )}
    </div>
  );
}
