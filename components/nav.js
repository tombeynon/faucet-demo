import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';

export function Nav() {
  const {
    isAuthenticated,
    logout
  } = useAuth0();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <span className="navbar-brand">Akash Faucet</span>

      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
          {/* <Link href="/users"> */}
          {/*   <a */}
          {/*     className={`nav-item nav-link${ */}
          {/*       pathname === '/users' ? ' active' : '' */}
          {/*     }`} */}
          {/*   > */}
          {/*     Users */}
          {/*   </a> */}
          {/* </Link> */}
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
