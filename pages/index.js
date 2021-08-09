import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import Countdown from 'react-countdown';
import { useApi } from '../hooks/use-api';
import { Loading } from '../components/loading';
import { Error } from '../components/error';
import { Form } from '../components/form';

const FAUCET_API = process.env.FAUCET_API || 'http://localhost:8080';

export default function Home() {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
  } = useAuth0();
  const [address, setAddress] = useState();
  const { pathname } = useRouter();

  const { loading, error, data } = useApi(
    `${FAUCET_API}`,
    {
      audience: process.env.NEXT_PUBLIC_AUDIENCE,
      scope: '',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (error) {
    return <Error message="Faucet is down" />;
  }

  if (isLoading) {
    return <Loading />;
  }

  var faucetAddress, unlockDate
  if(data){
    var {unlockDate} = data
    unlockDate = Date.parse(unlockDate)
  }

  return (
    <div>

      {isAuthenticated ? (
        <div>
          <p className="text-center">Hello, {user.nickname}</p>{' '}
          {unlockDate && unlockDate > Date.now() ? (
            <div className="text-center">
              <Countdown date={unlockDate}>
                <Form />
              </Countdown>
            </div>
          ) : (
            <Form />
          )}
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
