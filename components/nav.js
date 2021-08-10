import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode'

const AUDIENCE = process.env.NEXT_PUBLIC_AUDIENCE
const SCOPE = ''

export function Nav() {
  const {
    isAuthenticated,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  const [permissions, setPermissions] = useState([])

  const { pathname } = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({ AUDIENCE, SCOPE });
        if(accessToken){
          var decoded = jwt_decode(accessToken);
          setPermissions(decoded.permissions || [])
        }
      } catch { }
    })();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link href="/">
        <a><span className="navbar-brand">Akash Faucet</span></a>
      </Link>

      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
          {isAuthenticated && permissions.includes('manage:faucet') && (
            <Link href="/transactions">
              <a
                className={`nav-item nav-link${
                  pathname === '/transactions' ? ' active' : ''
                 }`}
              >
                Transactions
              </a>
            </Link>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <div>
          <button
            className="btn btn-outline-secondary"
            id="logout"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
