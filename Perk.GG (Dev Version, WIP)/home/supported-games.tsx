import Link from "next/link";

const games = [
  {
    name: "Space Engineers",
    logo: "https://i.imgur.com/LFPuyJq.png",
    href: "/se",
  },
  {
    name: "Starbase",
    logo: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpress.frozenbyte.com%2Fstarbase%2Fimages%2Flogo.png&f=1&nofb=1&ipt=edcbc2146ee514461094fda5baa9137080cf9fe6c7639054b94859a3ca6c1958&ipo=images",
    href: "/sb",
  },
  {
    name: "Minecraft",
    logo: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.freebiesupply.com%2Flogos%2Flarge%2F2x%2Fminecraft-logo-png-transparent.png&f=1&nofb=1&ipt=c7da4021b589320c207588e236f826d8d1857a720981e4cec7ca3bbadd59234a&ipo=images",
    href: "/mc",
  },
].sort(() => Math.random() - 0.5);

export default function SupportedGames() {
  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="pb-12">
          <p className="text-center text-4xl font-bold text-foreground">
            Supported Games
          </p>
          <p className="text mx-auto mt-6 max-w-lg text-balance text-center text-muted-foreground">
            We support a variety of games natively, and have plans to support
            many more in the future.
          </p>
        </div>
        <div className="-mx-6 grid grid-cols-2 gap-0.5 overflow-hidden sm:mx-0 sm:rounded-2xl md:grid-cols-3">
          {games.map((game) => (
            <Link key={game.name} href={game.href} className="h-full">
              <div
                key={game.name}
                className="group flex h-full justify-center bg-primary p-8 transition-all hover:bg-primary/90 sm:p-10"
              >
                <img
                  alt={game.name}
                  src={game.logo}
                  width={158}
                  height={48}
                  className="max-h-16 w-full object-contain transition-all group-hover:rotate-3 group-hover:scale-90"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
