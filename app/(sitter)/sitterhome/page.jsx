import Hero from "../../../component/SitterHome/Hero";
import Middle from "../../../component/SitterHome/Middle";
import ServiceForEveryDog from "../../../component/home/ServiceForEveryDog";
import NewHero from "@/component/SitterHome/NewHero";
import UpdatedHeroSection from "@/component/SitterHome/UpdatedHero";

export default function sitterLanding() {
  return (
    <>
      {/* <UpdatedHeroSection /> */}
      <NewHero />
      {/* <Hero /> */}
      <Middle />
      <ServiceForEveryDog />
    </>
  );
}
