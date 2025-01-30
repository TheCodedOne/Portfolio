"use client";

import { Radio, RadioGroup } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Frequency = "monthly" | "annually";

type Frequencies = { value: Frequency; label: string; priceSuffix: string }[];

const frequencies: Frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  { value: "annually", label: "Annually", priceSuffix: "/year" },
];

type Tier = {
  name: string;
  id: string;
  href: string;
  price:
    | {
        [key in Frequency]: string;
      }
    | "Custom";
  description: string;
  features: string[];
  featured: boolean;
};

const tiers: Tier[] = [
  {
    name: "Free",
    id: "tier-free",
    href: "#",
    price: { monthly: "$0", annually: "$0" },
    description: "Perfect for trying out our platform.",
    features: [
      "1 Cluster",
      "Up to 5 Staff Members",
      "Up to 50 Monthly Active Members",
      "Realtime Analytics",
      "1 Month Audit Log Retention",
      "Community Support",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    price: { monthly: "$29", annually: "$290" },
    description: "Everything you need to grow your community.",
    features: [
      "2 Clusters",
      "Up to 10 Staff Members",
      "Up to 500 Monthly Active Members",
      "Realtime Analytics with 30 Day History",
      "3 Months Audit Log Retention",
      "Custom Domain Available",
      "SAML SSO Available",
      "Priority Support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    price: "Custom",
    description: "Advanced features for large communities.",
    features: [
      "Custom Number of Clusters",
      "Custom Number of Staff Members",
      "Unlimited Monthly Active Members",
      "Custom Analytics History",
      "Custom Audit Log Retention",
      "Custom Domain Included",
      "SAML SSO Included",
      "Custom Roles",
      "Custom Branding",
      "Dedicated Success Manager",
      "Onboarding Tour",
    ],
    featured: false,
  },
];

export default function PricingSection() {
  const [frequency, setFrequency] = useState(frequencies[0]);

  useEffect(() => {
    if (frequency === undefined) setFrequency(frequencies[0]);
  }, [frequency]);

  if (frequency === undefined) return null;

  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Plans for communities of all sizes
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
          Every plan comes with a 14 day free trial. After that, you can choose
          to purchase a subscription plan or contact us for a custom quote.
        </p>
        <Link href="/pricing" className="mt-5 flex justify-center">
          <Button>View full details</Button>
        </Link>
        <div className="mt-16 flex justify-center">
          <fieldset aria-label="Payment frequency">
            <RadioGroup
              value={frequency}
              onChange={setFrequency}
              className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
            >
              {frequencies.map((option) => (
                <Radio
                  key={option.value}
                  value={option}
                  className="cursor-pointer rounded-full px-2.5 py-1 text-gray-500 data-[checked]:bg-primary data-[checked]:text-primary-foreground"
                >
                  {option.label}
                </Radio>
              ))}
            </RadioGroup>
          </fieldset>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                tier.featured ? "bg-primary ring-primary" : "ring-secondary",
                "rounded-3xl p-8 ring-1 xl:p-10",
              )}
            >
              <h3
                id={tier.id}
                className={cn(
                  tier.featured ? "text-primary-foreground" : "text-foreground",
                  "text-lg font-semibold leading-8",
                )}
              >
                {tier.name}
              </h3>
              <p
                className={cn(
                  tier.featured ? "text-muted" : "text-muted-foreground",
                  "mt-4 text-sm leading-6",
                )}
              >
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={cn(
                    tier.featured ?
                      "text-primary-foreground"
                    : "text-foreground",
                    "text-4xl font-bold tracking-tight",
                  )}
                >
                  {typeof tier.price === "string" ?
                    tier.price
                  : tier.price[frequency.value]}
                </span>
                {typeof tier.price !== "string" ?
                  <span
                    className={cn(
                      tier.featured ? "text-muted" : "text-muted-foreground",
                      "text-sm font-semibold leading-6",
                    )}
                  >
                    {frequency.priceSuffix}
                  </span>
                : null}
              </p>
              <Link
                href="/pricing"
                aria-describedby={tier.id}
                className={cn(
                  tier.featured ?
                    "bg-background text-foreground hover:bg-background/90 focus-visible:outline-background"
                  : "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-primary",
                  "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                )}
              >
                View full details
              </Link>
              <ul
                role="list"
                className={cn(
                  tier.featured ? "text-primary-foreground" : "text-foreground",
                  "mt-8 space-y-3 text-sm leading-6 xl:mt-10",
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className={cn(
                        tier.featured ?
                          "text-primary-foreground"
                        : "text-primary",
                        "h-6 w-5 flex-none",
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
