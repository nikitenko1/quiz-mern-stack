import React from 'react';

const InfoCard = ({ title, description, Icon }) => {
  return (
    <div className="infoCard">
      <div className="infoCard__left">
        <h2>{title}</h2>
        <h4>{description}</h4>
      </div>
      <div className="infoCard__right">
        <Icon />
      </div>
    </div>
  );
};

export default InfoCard;
