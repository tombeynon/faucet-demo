import React from 'react';

export function Loading() {
  return (
    <div className="text-center mb-5 mt-5">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
