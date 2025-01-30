import APIFeatureSection from "./api-feature";
import CommunityFeatureSection from "./community-feature";
import CTA from "./cta";
import Footer from "./footer";
import Hero from "./hero";

export default async function Home() {
  return (
    <div>
      <Hero />
      {/* <FeatureSection /> */}
      <CommunityFeatureSection />
      <APIFeatureSection />
      <CTA />
      <Footer />
    </div>
  );
}
