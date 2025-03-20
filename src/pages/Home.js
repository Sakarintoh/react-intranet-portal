import React from "react";
import HeroSection from "../components/HeroSection"; // ตรวจสอบให้แน่ใจว่า path ถูกต้อง
import NewsEvents from "../components/NewsEvents"; // ตรวจสอบให้แน่ใจว่า path ถูกต้อง

const Home = () => {
  return (
    <div>
      <HeroSection />
      <NewsEvents />
    </div>
  );
};

export default Home;
