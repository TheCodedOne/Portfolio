import Hero from "../hero";

// const hero: HeroProps = {
//   whatsNew: {
//     title: "What's new",
//     href: "#",
//   },
//   title: (
//     <span>
//       Grow your <span className="text-primary">Space Engineers</span> community
//     </span>
//   ),
//   image:
//     "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans/5134093/b3495c491278a90ba2ab0155ffac531d3a17dd85.png",
// };

export default async function Home() {
  return (
    <div>
      <Hero />
      {/* <PricingSection /> */}
    </div>
  );
}
