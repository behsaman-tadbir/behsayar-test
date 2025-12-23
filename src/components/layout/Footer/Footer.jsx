import React from "react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer__wave" aria-hidden="true">
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          role="img"
          aria-label="wave shape"
        >
          <path
            fill="var(--color-background)"
            d="M0,160 C240,120 480,40 720,80 C960,120 1200,200 1440,140 L1440,0 L0,0 Z"
          />
        </svg>
      </div>
      <div className="site-footer__body">
        <div className="container">
          <div className="footer__badges" aria-label="trust badges">
            <div className="badge-item">پشتیبانی در ساعات اداری</div>
            <div className="badge-item">تحویل سریع</div>
            <div className="badge-item">ضمانت اصل بودن کالا</div>
            <div className="badge-item">پرداخت با حکمت کارت (نمایشی)</div>
          </div>

          <div className="footer__grid">
            <div className="footer__column">
              <h4>پشتیبانی</h4>
              <ul>
                <li>
                  <a href="#">پشتیبانی</a>
                </li>
                <li>
                  <a href="#">راهنمای خرید</a>
                </li>
                <li>
                  <a href="#">راهنمای سامانه پیامکی</a>
                </li>
              </ul>
            </div>
            <div className="footer__column">
              <h4>درباره</h4>
              <ul>
                <li>
                  <a href="#">درباره ما</a>
                </li>
                <li>
                  <a href="#">تماس با ما</a>
                </li>
                <li>
                  <a href="#">قوانین و مقررات</a>
                </li>
              </ul>
            </div>
            <div className="footer__column">
              <h4>تماس (نمایشی)</h4>
              <ul>
                <li>SMS: ۳۰۰۰۷۱۲۳</li>
                <li>Email: info@mehr-soleyman.demo</li>
                <li>آدرس: تهران، خیابان نمونه ۱۲۳</li>
              </ul>
            </div>
            <div className="footer__column">
              <h4>شبکه‌های اجتماعی</h4>
              <ul>
                <li>
                  <a href="#">ایتا</a>
                </li>
                <li>
                  <a href="#">بله</a>
                </li>
                <li>
                  <a href="#">روبیکا</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__intro">
            <p>
              مهر سلیمان یک نمونه نمایشی برای معرفی تجربه آموزشی «سولی لرنو» است.
              این نسخه صرفاً برای ارائه و تصمیم‌گیری طراحی شده و از داده‌های ماک
              استفاده می‌کند.
            </p>
          </div>

          <div className="footer__stats">
            <div>
              <strong>بازدید کل:</strong> ۱۲,۳۴۵
            </div>
            <div>
              <strong>امروز:</strong> ۲۳۴
            </div>
            <div>
              <strong>دیروز:</strong> ۱۹۸
            </div>
          </div>

          <div className="footer__bottom">
            <div className="footer__enamad" aria-label="enamad placeholder">
              ENAMAD
            </div>
            <div className="footer__copy">
              © کلیه حقوق این سایت متعلق به پروژه مهر سلیمان می‌باشد.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
