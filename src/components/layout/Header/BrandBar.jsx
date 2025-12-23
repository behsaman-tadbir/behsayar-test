import React from "react";

const BrandBar = ({ collapsed }) => {
  return (
    <div className={`brand-bar${collapsed ? " brand-bar--collapsed" : ""}`}>
      <div className="container brand-bar__inner">
        <div className="brand-bar__right">
          <strong className="brand-bar__title">مهر سلیمان</strong>
        </div>
        <div className="brand-bar__center">
          <span className="brand-bar__logo" aria-label="Solico logo placeholder">
            LOGO
          </span>
        </div>
        <div className="brand-bar__left" aria-hidden="true" />
      </div>
    </div>
  );
};

export default BrandBar;
