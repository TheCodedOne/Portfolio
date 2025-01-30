export type Frequency = "monthly" | "annually";

export type Tier = {
  name: "Free" | "Pro" | "Enterprise";
  id: string;
  href: string;
  priceMonthly: number | "Custom";
  priceAnnual: number | "Custom";
  mostPopular: boolean;
};

export type Feature = {
  name: string;
  tiers: {
    [key in Tier["name"]]?: boolean | string;
  };
};

export type Section = {
  name: string;
  features: Feature[];
};

const ALL_TIERS: Feature["tiers"] = {
  Free: true,
  Pro: true,
  Enterprise: true,
};

const PRO_TIERS: Feature["tiers"] = {
  Pro: true,
  Enterprise: true,
};

const ENTERPRISE_TIERS: Feature["tiers"] = {
  Enterprise: true,
};

export const tiers: Tier[] = [
  {
    name: "Free",
    id: "tier-free",
    href: "#",
    priceMonthly: 0,
    priceAnnual: 0,
    mostPopular: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: 29,
    priceAnnual: 290,
    mostPopular: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "Custom",
    priceAnnual: "Custom",
    mostPopular: false,
  },
];

export const sections: Section[] = [
  {
    name: "Community",
    features: [
      {
        name: "Clusters",
        tiers: { Free: "1", Pro: "2", Enterprise: "Custom" },
      },
      {
        name: "Monthly active members",
        tiers: {
          Free: "Up to 50",
          Pro: "Up to 500",
          Enterprise: "Unlimited",
        },
      },
      {
        name: "Staff members",
        tiers: {
          Free: "Up to 5",
          Pro: "Up to 10",
          Enterprise: "Custom",
        },
      },
      {
        name: "Custom domain",
        tiers: {
          Pro: "Available for $10 per month",
          Enterprise: true,
        },
      },
      {
        name: "Audit log retention",
        tiers: {
          Free: "1 Month",
          Pro: "3 Months",
          Enterprise: "Custom",
        },
      },
      {
        name: "Custom roles",
        tiers: ENTERPRISE_TIERS,
      },
      {
        name: "SAML Single sign-on",
        tiers: {
          Pro: "Available for $50 per month",
          Enterprise: true,
        },
      },
      {
        name: "Custom branding",
        tiers: ENTERPRISE_TIERS,
      },
    ],
  },
  {
    name: "Reporting",
    features: [
      {
        name: "Realtime analytics",
        tiers: ALL_TIERS,
      },
      {
        name: "Analytics History",
        tiers: {
          Free: "7 days",
          Pro: "30 days",
          Enterprise: "Custom",
        },
      },
    ],
  },
  {
    name: "Support",
    features: [
      {
        name: "Community support",
        tiers: ALL_TIERS,
      },
      {
        name: "Priority support",
        tiers: PRO_TIERS,
      },
      {
        name: "Dedicated Success Manager",
        tiers: ENTERPRISE_TIERS,
      },
      { name: "Onboarding tour", tiers: ENTERPRISE_TIERS },
    ],
  },
];

export function convertFeatureKey(
  feature: Feature,
  tier: Tier["name"],
): boolean | string {
  if (typeof feature.tiers === "boolean" || typeof feature.tiers === "string") {
    return feature.tiers;
  }

  return feature.tiers[tier] ?? false;
}
