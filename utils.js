export async function callApi(url, accessToken, options) {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json()
    return {
      data: data,
      error: !res.ok && {message: data.error}
    };
  } catch (error) {
    return {
      error
    };
  }
}
