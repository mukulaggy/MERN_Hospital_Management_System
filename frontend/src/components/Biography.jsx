import React from "react";

const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img src={imageUrl} alt="whoweare" />
        </div>
        <div className="banner">
          <p>Biography</p>
          <h3>Who We Are</h3>
          <p>
            Welcome to the future of healthcare. Our e-Health Management System
            is a cutting-edge platform designed to revolutionize how patients,
            healthcare providers, and administrators manage health information
            and services. This comprehensive system integrates modern technology
            with healthcare practices to improve efficiency, accessibility, and
            quality of care.
          </p>
          <p>We are all in 2024!</p>
          <p>
            Vision: To create a seamless healthcare experience through
            innovative technology, making healthcare management accessible and
            efficient for everyone. Mission: To empower patients and healthcare
            providers with a robust, user-friendly platform that streamlines the
            management of health records, appointments, prescriptions, and
            overall patient care.
          </p>  
        </div>
      </div>
    </>
  );
};

export default Biography;
