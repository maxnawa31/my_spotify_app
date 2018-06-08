import React from 'react';
import '../styles/CardSection.css'

const CardSection = (props) => {
  return (
    <div className='card-section' >
      { props.children }
    </div>
  );
};



export default CardSection;