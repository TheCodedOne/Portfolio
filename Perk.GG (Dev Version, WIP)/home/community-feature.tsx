import { Heart, MessageSquare, PenSquare, Trash } from "lucide-react";

const features = [
  {
    name: "Factions",
    description:
      "Keep up to date with factions, even when not in the game. Get notifications for faction events, organize your assets, and more.",
    icon: Heart,
  },
  {
    name: "Player Events",
    description:
      "Organize and participate in community events like races, building competitions, and combat tournaments. Bring players together and create memorable experiences.",
    icon: MessageSquare,
  },
  {
    name: "Community Posts",
    description:
      "Share your builds, strategies and stories with the community. Get feedback, showcase your creations and engage with other players.",
    icon: PenSquare,
  },
  {
    name: "Ship Marketplace",
    description:
      "Buy and sell ships in the marketplace. Find the perfect vessel for your next mission or make a profit trading unique designs.",
    icon: Trash,
  },
];

export default function CommunityFeatureSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <div className="col-span-2">
            <h2 className="text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Engage with the community
            </h2>
            <span className="mt-4 inline-flex rounded-full bg-ring/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-ring/10">
              Coming Soon
            </span>
          </div>
          <dl className="col-span-3 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt className="text-base/7 font-semibold text-foreground">
                  <div className="mb-6 flex size-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon
                      aria-hidden="true"
                      className="size-6 text-primary-foreground"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 text-base/7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
