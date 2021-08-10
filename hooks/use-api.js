import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { callApi } from '../utils'

export const useApi = (url, options, lastFunded) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const { error, data, txURL } = await callApi(url, accessToken, options)

        setState({
          data,
          error,
          loading: false
        });
      } catch (error) {
        setState({
          error,
          loading: false
        });
      }
    })();
  }, [lastFunded]);

  return state;
};
