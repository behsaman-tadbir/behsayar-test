import React, { useEffect, useState } from "react";
import BrandBar from "./BrandBar";
import UtilityBar from "./UtilityBar";

const categories = [
  "پیش‌دبستان و دبستان",
  "متوسطه اول",
  "متوسطه دوم",
  "کنکور تا دکتری",
  "کودک و نوجوان",
  "...",
];

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [brandCollapsed, setBrandCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (!mobile) {
        setIsDrawerOpen(false);
      }
    };
    const handleScroll = () => {
      setBrandCollapsed(window.scrollY > 24);
    };
    handleResize();
    handleScroll();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <header className="site-header">
      <BrandBar collapsed={brandCollapsed} />
      <UtilityBar
        categories={categories}
        onToggleDrawer={toggleDrawer}
        isDrawerOpen={isDrawerOpen}
        isMobile={isMobile}
      />
    </header>
  );
};

export default Header;
