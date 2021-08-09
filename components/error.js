import React from 'react';

export function Error({ message, button }) {
  const reload = () => {
    window.location.reload()
  }

  return (
    <div>
      <div className="alert alert-danger" role="alert">
        Oops... {message}
      </div>
      <p><button onClick={reload} className="btn btn-block btn-large">{button || 'Back'}</button></p>
    </div>
  );
}
