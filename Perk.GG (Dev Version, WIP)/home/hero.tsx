import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BorderBeam } from "./border-beam";
import { Logo } from "./logo";
import { Meteors } from "./meteors";

const url =
  process.env.NODE_ENV === "development" ?
    "http://app.localhost:3000"
  : "https://app.perk.gg";

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-background">
      <Meteors />
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-primary/30 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
        />
      </svg>
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 lg:flex lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <Logo className="h-11 fill-primary" />
          <div className="mt-12 sm:mt-16">
            <a href="#" className="inline-flex space-x-2">
              <span className="rounded-full bg-ring/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-ring/10">
                What&apos;s new
              </span>
              <span className="relative inline-flex items-center space-x-2 rounded-full pl-5 pr-1 text-sm font-medium leading-6 text-muted-foreground">
                <span>v1.0 Coming Soon</span>
                <ChevronRight
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <BorderBeam
                  size={50}
                  duration={2}
                  colorFrom="hsl(var(--primary))"
                  colorTo="hsl(var(--primary))"
                />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-4xl font-bold text-foreground sm:text-5xl">
            Grow your <span className="text-primary">Space Engineers</span>{" "}
            community
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground/80"></p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link href={url}>
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="https://discord.gg/9k5r4VgaKT" target="_blank">
              <Button size="lg" variant="outline">
                Join discord
              </Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-ring/10 p-2 ring-1 ring-inset ring-ring/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans/5134093/b3495c491278a90ba2ab0155ffac531d3a17dd85.png"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
