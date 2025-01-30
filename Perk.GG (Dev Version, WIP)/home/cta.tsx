export default function CTA() {
  const url =
    process.env.NODE_ENV === "development" ?
      "http://app.localhost:3000"
    : "https://app.perk.gg";

  return (
    <div className="bg-background">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Get started today
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg/8 text-muted-foreground">
            Take the first step towards a more engaging community, get started
            completely free today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href={url}
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Get started
            </a>
            <a
              href="https://discord.gg/9k5r4VgaKT"
              target="_blank"
              className="text-sm/6 font-semibold text-foreground hover:text-primary"
            >
              Join discord <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
