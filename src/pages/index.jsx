import React from "react";
import Head from "next/head";

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
    image: "placeholders/banner-wide.svg",
    alt: "بنر ویژه تابستان",
  },
  {
    id: 2,
    kicker: "پیشنهاد هدیه",
    title: "کارت‌های تجربه آموزشی نمایشی",
    subtitle: "امکان تست رابط کاربری برای خانواده‌ها و مربیان.",
    image: "placeholders/banner-wide.svg",
    alt: "بنر پیشنهاد هدیه",
  },
];

const HomePage = () => {
  const meta = {
    title: "مهر سلیمان | سولی لرنو",
    description:
      "نسخه دمو صفحه اصلی مهر سلیمان برای نمایش تجربه آموزشی سولی لرنو؛ بدون اتصال به سرویس یا پرداخت واقعی.",
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`}
        />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
      </Head>

      <Header />

      <main id="main-content">
        {/* Section 1: Hero Ads + Slider */}
        <section id="hero-ads-slider" aria-label="تبلیغات و اسلایدر اصلی">
          <div className="container">
            <p className="eyebrow">سولی لرنو</p>
            <h1>مهر سلیمان</h1>
            {/* H2 برای سکشن (حفظ ساختار سئو) */}
            <h2 className="sr-only">اسلایدر و تبلیغات</h2>
          </div>
          <HeroAdsSlider ads={ads} slides={slides} />
        </section>

        {/* Section 2: Categories */}
        <section id="category-circles" aria-label="دسته‌بندی‌های آموزشی">
          <div className="container">
            <h2>دسته‌بندی‌ها</h2>
          </div>
          <CategoryCircles categories={categories} />
        </section>

        {/* Section 3: Double banners */}
        <section id="double-banners" aria-label="بنرهای تبلیغاتی ویژه">
          <div className="container">
            <h2>پیشنهادهای ویژه</h2>
          </div>
          <DoubleBanners banners={bannerPromos} />
        </section>

        {/* Section 4: Best sellers */}
        <section id="best-sellers" aria-label="پرفروش‌ترین محصولات">
          <ProductRail
            title="پرفروش‌ترین‌ها"
            subtitle="منتخب نمایشی با داده ماک"
            products={bestProducts}
            variant="best"
            headingId="best-products-heading"
          />
        </section>

        {/* Section 5: Newest */}
        <section id="newest" aria-label="جدیدترین محصولات">
          <ProductRail
            title="جدیدترین‌ها"
            subtitle="تازه‌های اضافه‌شده به نسخه دمو"
            products={newProducts}
            variant="new"
            headingId="new-products-heading"
          />
        </section>

        {/* Section 6: Top centers */}
        <section id="top-centers" aria-label="محبوب‌ترین مراکز آموزشی">
          <div className="container">
            <h2>محبوب‌ترین مراکز آموزشی</h2>
          </div>
          <CentersRail centers={centers} />
        </section>

        {/* Section 7: About Solico */}
        <section id="about-solico" aria-label="معرفی سولیکو">
          <div className="container">
            <h2>درباره سولیکو</h2>
          </div>
          <AboutSolicoSplit />
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
