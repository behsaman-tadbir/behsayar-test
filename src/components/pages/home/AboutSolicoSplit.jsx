import React from "react";

const AboutSolicoSplit = () => {
  return (
    <section className="home-section about-split" aria-labelledby="about-solico-heading">
      <div className="container about-split__layout">
        <div className="about-split__text">
          <h2 id="about-solico-heading" className="section-title">
            معرفی کوتاه سولیکو
          </h2>
          <p className="about-split__lead">
            سولی لرنو در این نسخه‌ی MVP تنها برای نمایش مسیر یادگیری ساخته شده
            است؛ همه چیز ماک و ایمن بوده و هیچ پرداخت یا ثبت‌نام واقعی انجام نمی‌شود.
          </p>
          <ul className="about-split__list">
            <li>مسیرهای یادگیری مرحله‌ای با توضیحات شفاف و مختصر.</li>
            <li>پیشنهادهای شخصی‌سازی‌شده بدون نیاز به اتصال به سرویس بیرونی.</li>
            <li>تجربه کاربری RTL با فونت وزیرمتن و گرید واکنش‌گرا.</li>
          </ul>
        </div>
        <div className="about-split__media">
          <img
            src="/placeholders/banner-wide.svg"
            alt="تصویر نمادین سولیکو"
            width="1200"
            height="360"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSolicoSplit;
