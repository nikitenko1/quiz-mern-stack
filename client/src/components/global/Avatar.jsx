import React from 'react';

const Avatar = ({ src, alt, onClick }) => {
  return (
    <div className="avatar" onClick={onClick}>
      <img src={src} alt={alt} />
    </div>
  );
};

export default Avatar;
