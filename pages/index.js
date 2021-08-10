import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from '../components/loading';
import { Faucet } from '../components/faucet';

export default function Home() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect
  } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="main container">
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
