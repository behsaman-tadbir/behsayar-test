import React from "react";

const UtilityBar = ({
  onToggleDrawer,
  isDrawerOpen,
  isMobile,
  categories,
}) => {
  return (
    <div className="utility-bar">
      <div className="container utility-bar__inner">
        <div className="utility-bar__right">
          <div className="utility-bar__product">
            <strong>سولی لرنو</strong>
            <div className="utility-bar__search">
              <input
                type="search"
                placeholder="جستجو..."
                aria-label="جستجو"
              />
              <button
                type="button"
                className="utility-bar__search-btn"
                aria-label="شروع جستجو"
                onClick={() => console.log("search submitted")}
              >
                🔍
              </button>
            </div>
          </div>
        </div>
        <nav className="utility-bar__nav" aria-label="دسته‌بندی‌ها">
          <button
            type="button"
            className="utility-bar__hamburger"
            aria-label={isDrawerOpen ? "بستن منو" : "باز کردن منو"}
            onClick={onToggleDrawer}
          >
            ☰
          </button>
          <ul className="utility-bar__menu">
            {categories.map((item) => (
              <li key={item}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="utility-bar__left">
          <button type="button" className="btn btn-cta">
            ورود / ثبت‌نام
          </button>
          <button
            type="button"
            className="utility-bar__cart"
            aria-label="سبد خرید"
          >
            🛒
            <span className="badge">2</span>
          </button>
        </div>
      </div>
      {isMobile && (
        <div
          className={`drawer${isDrawerOpen ? " drawer--open" : ""}`}
          role="dialog"
          aria-label="منوی دسته‌بندی"
        >
          <ul className="drawer__menu">
            {categories.map((item) => (
              <li key={item}>
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UtilityBar;
