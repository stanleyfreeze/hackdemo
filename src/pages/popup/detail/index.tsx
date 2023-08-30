import React, { useEffect } from 'react';

export default function Detail() {
  useEffect(() => {
    console.log('detail', location.hash);
  }, []);
  return <div>Detail Page</div>;
}
