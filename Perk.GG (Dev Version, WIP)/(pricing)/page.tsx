import { CheckIcon, MinusIcon } from "lucide-react";
import { Fragment } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { convertFeatureKey, sections, tiers } from "./pricing-data";

export default function PricingPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Plans for communities of&nbsp;all&nbsp;sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
          Every plan comes with a 14 day free trial. After that, you can choose
          to purchase a subscription plan or contact us for a custom quote.
        </p>

        {/* xs to lg */}
        <div className="mx-auto mt-12 max-w-md space-y-8 sm:mt-16 lg:hidden">
          {tiers.map((tier) => (
            <section
              key={tier.id}
              className={cn(
                tier.mostPopular ?
                  "rounded-xl bg-primary/5 ring-1 ring-inset ring-primary/10"
                : "",
                "p-8",
              )}
            >
              <h3
                id={tier.id}
                className="text-sm font-semibold leading-6 text-foreground"
              >
                {tier.name}
              </h3>
              <p className="mt-2 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold text-foreground">
                  {typeof tier.priceMonthly === "number" ?
                    "$" + tier.priceMonthly
                  : tier.priceMonthly}
                </span>
                {typeof tier.priceMonthly === "number" && (
                  <span className="text-sm font-semibold text-muted-foreground">
                    /month
                  </span>
                )}
              </p>
              <Button
                className="mt-8 w-full"
                variant={tier.mostPopular ? "default" : "outline"}
                aria-describedby={tier.id}
              >
                {tier.priceMonthly !== "Custom" ? "Choose plan" : "Contact us"}
              </Button>
              <ul
                role="list"
                className="mt-10 space-y-4 text-sm leading-6 text-foreground"
              >
                {sections.map((section) => (
                  <li key={section.name}>
                    <ul role="list" className="space-y-4">
                      {section.features.map((feature) => {
                        const featureTier = convertFeatureKey(
                          feature,
                          tier.name,
                        );
                        if (!featureTier) return null;
                        return (
                          <li key={feature.name} className="flex gap-x-3">
                            <CheckIcon
                              aria-hidden="true"
                              className="h-6 w-5 flex-none text-primary"
                            />
                            <span>
                              {feature.name}{" "}
                              {typeof featureTier === "string" ?
                                <span className="text-sm leading-6 text-muted-foreground">
                                  ({featureTier})
                                </span>
                              : null}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* lg+ */}
        <div className="isolate mt-20 hidden lg:block">
          <div className="relative -mx-8">
            {tiers.some((tier) => tier.mostPopular) ?
              <div className="absolute inset-x-4 inset-y-0 -z-10 flex">
                <div
                  style={{
                    marginLeft: `${(tiers.findIndex((tier) => tier.mostPopular) + 1) * 25}%`,
                  }}
                  aria-hidden="true"
                  className="flex w-1/4 px-4"
                >
                  <div className="w-full rounded-t-xl border-x border-t border-primary/10 bg-primary/5" />
                </div>
              </div>
            : null}
            <table className="w-full table-fixed border-separate border-spacing-x-8 text-left">
              <caption className="sr-only">Pricing plan comparison</caption>
              <colgroup>
                <col className="w-1/4" />
                <col className="w-1/4" />
                <col className="w-1/4" />
                <col className="w-1/4" />
              </colgroup>
              <thead>
                <tr>
                  <td />
                  {tiers.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className="px-6 pt-6 xl:px-8 xl:pt-8"
                    >
                      <div className="text-sm font-semibold leading-7 text-foreground">
                        {tier.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">
                    <span className="sr-only">Price</span>
                  </th>
                  {tiers.map((tier) => (
                    <td key={tier.id} className="px-6 pt-2 xl:px-8">
                      <div className="flex items-baseline gap-x-1 text-foreground">
                        <span className="text-4xl font-bold">
                          {typeof tier.priceMonthly === "number" ?
                            "$" + tier.priceMonthly
                          : tier.priceMonthly}
                        </span>
                        {typeof tier.priceMonthly === "number" && (
                          <span className="text-sm font-semibold leading-6">
                            /month
                          </span>
                        )}
                      </div>
                      <Button
                        className="mt-8 w-full"
                        variant={tier.mostPopular ? "default" : "outline"}
                      >
                        {tier.priceMonthly !== "Custom" ?
                          "Choose plan"
                        : "Contact us"}
                      </Button>
                    </td>
                  ))}
                </tr>
                {sections.map((section, sectionIdx) => (
                  <Fragment key={section.name}>
                    <tr>
                      <th
                        scope="colgroup"
                        colSpan={4}
                        className={cn(
                          sectionIdx === 0 ? "pt-8" : "pt-16",
                          "pb-4 text-sm font-semibold leading-6 text-foreground",
                        )}
                      >
                        {section.name}
                        <div className="absolute inset-x-8 mt-4 h-px bg-foreground/10" />
                      </th>
                    </tr>
                    {section.features.map((feature) => (
                      <tr key={feature.name}>
                        <th
                          scope="row"
                          className="py-4 text-sm font-normal leading-6 text-foreground"
                        >
                          {feature.name}
                          <div className="absolute inset-x-8 mt-4 h-px bg-foreground/5" />
                        </th>
                        {tiers.map((tier) => {
                          const featureTier = convertFeatureKey(
                            feature,
                            tier.name,
                          );
                          return (
                            <td key={tier.id} className="px-6 py-4 xl:px-8">
                              {typeof featureTier === "string" ?
                                <div className="text-center text-sm leading-6 text-muted-foreground">
                                  {featureTier}
                                </div>
                              : <>
                                  {featureTier === true ?
                                    <CheckIcon
                                      aria-hidden="true"
                                      className="mx-auto h-5 w-5 text-primary"
                                    />
                                  : <MinusIcon
                                      aria-hidden="true"
                                      className="mx-auto h-5 w-5 text-muted"
                                    />
                                  }

                                  <span className="sr-only">
                                    {featureTier === true ?
                                      "Included"
                                    : "Not included"}{" "}
                                    in {tier.name}
                                  </span>
                                </>
                              }
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
