import React from 'react';
import './FooterStyles.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div>
          <h1>Tunis Routes</h1>
        </div>
      </div>
      <div className="bottom">
        <p>&copy; {new Date().getFullYear()} Tunis Routes. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
