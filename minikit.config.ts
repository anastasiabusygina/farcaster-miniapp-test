const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: process.env.FARCASTER_HEADER || "",
    payload: process.env.FARCASTER_PAYLOAD || "",
    signature: process.env.FARCASTER_SIGNATURE || "",
  },
  baseBuilder: {
    allowedAddresses: [],
  },
  miniapp: {
    version: "1",
    name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "your-mini-project",
    subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE || "",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "",
    screenshotUrls: [],
    iconUrl: process.env.NEXT_PUBLIC_APP_ICON || `${ROOT_URL}/icon.png`,
    splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE || `${ROOT_URL}/splash.png`,
    splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: (process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY as any) || "utility",
    tags: ["example"],
    heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE || `${ROOT_URL}/hero.png`,
    tagline: process.env.NEXT_PUBLIC_APP_TAGLINE || "",
    ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE || "",
    ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION || "",
    ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE || `${ROOT_URL}/hero.png`,
  },
} as const;
