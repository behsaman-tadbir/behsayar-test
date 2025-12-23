import React from "react";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import HeroAdsSlider from "../components/pages/home/HeroAdsSlider";
import CategoryCircles from "../components/pages/home/CategoryCircles";
import DoubleBanners from "../components/pages/home/DoubleBanners";
import ProductRail from "../components/pages/home/ProductRail";
import CentersRail from "../components/pages/home/CentersRail";
import AboutSolicoSplit from "../components/pages/home/AboutSolicoSplit";

import ads from "../../mock-data/ads.json";
import slides from "../../mock-data/slides.json";
import categories from "../../mock-data/categories.json";
import bestProducts from "../../mock-data/products-best.json";
import newProducts from "../../mock-data/products-new.json";
import centers from "../../mock-data/centers.json";

const bannerPromos = [
  {
    id: 1,
    kicker: "ویژه تابستان",
    title: "مسیرهای جذاب بدون نیاز به پرداخت",
    subtitle: "تمام بنرها صرفاً برای نمایش تجربه کاربری هستند.",
    image: "/placeholders/banner-wide.svg",
    alt: "بنر ویژه تابستان",
  },
  {
    id: 2,
    kicker: "پیشنهاد هدیه",
    title: "کارت‌های تجربه آموزشی نمایشی",
    subtitle: "امکان تست رابط کاربری برای خانواده‌ها و مربیان.",
    image: "/placeholders/banner-wide.svg",
    alt: "بنر پیشنهاد هدیه",
  },
];

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroAdsSlider ads={ads} slides={slides} />
        <CategoryCircles categories={categories} />
        <DoubleBanners banners={bannerPromos} />
        <ProductRail
          title="پرفروش‌ترین‌ها"
          subtitle="منتخب نمایشی با داده ماک"
          products={bestProducts}
          variant="best"
          headingId="best-products-heading"
        />
        <ProductRail
          title="جدیدترین‌ها"
          subtitle="تازه‌های اضافه‌شده به نسخه دمو"
          products={newProducts}
          variant="new"
          headingId="new-products-heading"
        />
        <CentersRail centers={centers} />
        <AboutSolicoSplit />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
