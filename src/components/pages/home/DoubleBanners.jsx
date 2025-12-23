import React from "react";

const DoubleBanners = ({ banners = [] }) => {
  if (!banners.length) return null;

  return (
    <section className="home-section" aria-labelledby="double-banners-heading">
      <div className="container">
        <h2 id="double-banners-heading" className="section-title">
          دو بنر ویژه
        </h2>
        <div className="double-banners">
          {banners.map((banner) => (
            <article key={banner.id} className="double-banner" aria-label={banner.title}>
              <div className="double-banner__media">
                <img
                  src={banner.image}
                  alt={banner.alt}
                  width="1200"
                  height="360"
                  loading="lazy"
                />
              </div>
              <div className="double-banner__content">
                <p className="eyebrow">{banner.kicker}</p>
                <p className="double-banner__title">{banner.title}</p>
                <p className="double-banner__subtitle">{banner.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoubleBanners;
