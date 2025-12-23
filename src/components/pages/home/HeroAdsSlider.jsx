import React, { useEffect, useState } from "react";

const HeroAdsSlider = ({ ads = [], slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!slides.length) return undefined;
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToSlide = (index) => {
    if (!slides.length) return;
    const safeIndex = (index + slides.length) % slides.length;
    setCurrentSlide(safeIndex);
  };

  if (!ads.length && !slides.length) return null;

  return (
    <section className="home-section hero-section" aria-labelledby="home-hero-heading">
      <div className="container">
        <div className="hero-section__intro">
          <p className="eyebrow">سولی لرنو</p>
          <h1 id="home-hero-heading">مهر سلیمان</h1>
          <p className="hero-section__lead">
            نسخه نمایشی برای تجربه‌ی ساده و روان آموزش؛ بدون نیاز به پرداخت یا
            اتصال به هرگونه سرویس بیرونی.
          </p>
          <h2 className="section-title">پیشنهادهای نمایشی امروز</h2>
        </div>
        <div className="hero-section__grid">
          <div className="hero-section__ads" aria-label="باکس‌های تبلیغاتی نمایشی">
            <div className="hero-section__ads-inner">
              <div className="ads-grid" role="list">
                {ads.map((ad) => (
                  <article
                    key={ad.id}
                    className="ad-card"
                    role="listitem"
                    style={{ background: ad.background }}
                    aria-label={ad.title}
                  >
                    <div className="ad-card__media" aria-hidden="true">
                      <img
                        src={ad.image}
                        alt={ad.alt}
                        width="600"
                        height="600"
                        loading="lazy"
                      />
                    </div>
                    <div className="ad-card__content">
                      <p className="ad-card__eyebrow">{ad.subtitle}</p>
                      <p className="ad-card__title">{ad.title}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div
            className="hero-section__slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            aria-label="اسلایدر معرفی"
          >
            <div className="slider__frame">
              <div
                className="slider__track"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {slides.map((slide) => (
                  <article
                    key={slide.id}
                    className="slider__slide"
                    aria-roledescription="اسلاید"
                    aria-label={slide.title}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      width="1200"
                      height="600"
                      loading="lazy"
                    />
                    <div className="slider__overlay" aria-live="polite">
                      <p className="eyebrow">{slide.title}</p>
                      <p className="slider__description">{slide.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="slider__controls" aria-label="کنترل‌های اسلایدر">
              <button
                type="button"
                className="slider__button"
                onClick={() => goToSlide(currentSlide - 1)}
                aria-label="اسلاید قبلی"
              >
                ‹
              </button>
              <div className="slider__dots" role="tablist" aria-label="لیست اسلایدها">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    className={`slider__dot ${index === currentSlide ? "is-active" : ""}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`رفتن به اسلاید ${index + 1}`}
                    aria-pressed={index === currentSlide}
                  />
                ))}
              </div>
              <button
                type="button"
                className="slider__button"
                onClick={() => goToSlide(currentSlide + 1)}
                aria-label="اسلاید بعدی"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroAdsSlider;
