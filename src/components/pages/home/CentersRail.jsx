import React from "react";

const CentersRail = ({ centers = [] }) => {
  if (!centers.length) return null;

  return (
    <section className="home-section" aria-labelledby="centers-heading">
      <div className="container">
        <h2 id="centers-heading" className="section-title">
          محبوب‌ترین مراکز آموزشی
        </h2>
        <div className="centers-rail" role="list" aria-label="لوگو مراکز آموزشی">
          {centers.map((center) => (
            <article key={center.id} className="center-card" role="listitem">
              <img
                src={center.logo}
                alt={`لوگوی ${center.name}`}
                width="200"
                height="120"
                loading="lazy"
              />
              <p className="center-card__name">{center.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CentersRail;
