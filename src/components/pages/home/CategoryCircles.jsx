import React from "react";

const CategoryCircles = ({ categories = [] }) => {
  if (!categories.length) return null;

  return (
    <section className="home-section" aria-labelledby="categories-heading">
      <div className="container">
        <h2 id="categories-heading" className="section-title">
          دسته‌بندی‌های محبوب
        </h2>
        <div className="category-circles" role="list">
          {categories.map((category) => (
            <article key={category.id} className="category-card" role="listitem">
              <div className="category-card__circle">
                <img
                  src={category.image}
                  alt={`دسته‌بندی ${category.name}`}
                  width="120"
                  height="120"
                  loading="lazy"
                />
              </div>
              <p className="category-card__name">{category.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCircles;
