import React from "react";

const formatPrice = (value) =>
  `${new Intl.NumberFormat("fa-IR").format(value)} تومان`;

const ProductRail = ({ title, subtitle, ctaLabel = "مشاهده همه", products = [], variant = "default", headingId }) => {
  if (!products.length) return null;

  return (
    <section
      className={`home-section product-rail product-rail--${variant}`}
      aria-labelledby={headingId}
    >
      <div className="container">
        <div className="product-rail__layout">
          <div className="product-rail__header">
            <p className="eyebrow">{subtitle}</p>
            <h2 id={headingId} className="section-title">
              {title}
            </h2>
            <button type="button" className="link-cta" aria-label={`${ctaLabel} ${title}`}>
              {ctaLabel}
            </button>
          </div>
          <div className="product-rail__scroller" role="list" aria-label={title}>
            {products.map((product) => (
              <article key={product.id} className="product-card" role="listitem">
                <div className="product-card__media">
                  <img
                    src={product.image}
                    alt={`محصول ${product.name}`}
                    width="300"
                    height="320"
                    loading="lazy"
                  />
                  <span className="product-card__badge">٪{product.discount}</span>
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{product.name}</h3>
                  <div className="product-card__provider">
                    <img
                      src={product.providerLogo}
                      alt={`لوگوی ${product.provider}`}
                      width="64"
                      height="40"
                      loading="lazy"
                    />
                    <span>{product.provider}</span>
                  </div>
                  <div className="product-card__pricing">
                    <span className="product-card__price">
                      {formatPrice(product.price)}
                    </span>
                    <span className="product-card__old-price">
                      {formatPrice(product.oldPrice)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductRail;
