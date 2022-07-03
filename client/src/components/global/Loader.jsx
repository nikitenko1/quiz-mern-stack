import React from 'react';

const Loader = ({ width, height, border }) => {
  return (
    <div
      style={{ width, height, borderWidth: border }}
      className="loader"
    ></div>
  );
};

export default Loader;
