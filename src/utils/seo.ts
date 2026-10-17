/**
 * src/utils/seo.ts
 * Environment-driven SEO, Canonical URL, and Schema.org JSON-LD generators.
 *
 * Supports dynamic domain switching (e.g., Pages dev domain vs. custom domain)
 * via the PUBLIC_SITE_URL environment variable.
 */

export function getSiteUrl(): string {
  const envUrl = typeof process !== "undefined" ? process.env?.PUBLIC_SITE_URL : undefined;
  const siteUrl = envUrl || "https://getdepositrescue.com";
  return siteUrl.replace(/\/+$/, "");
}

/**
 * Returns the fully qualified canonical URL for a given pathname.
 * Respects trailingSlash: 'never' (keeps trailing slash only for the root URL).
 */
export function getCanonicalUrl(pathname: string): string {
  const base = getSiteUrl();
  const cleanPath = pathname ? (pathname.startsWith("/") ? pathname : `/${pathname}`) : "/";

  if (cleanPath === "/" || cleanPath === "") {
    return `${base}/`;
  }

  // Remove trailing slashes for non-root paths per Astro trailingSlash: 'never'
  const normalizedPath = cleanPath.replace(/\/+$/, "");
  return `${base}${normalizedPath}`;
}

/**
 * Returns the fully qualified Open Graph image URL.
 */
export function getOgImageUrl(imagePath: string = "/og-image.png"): string {
  const base = getSiteUrl();
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${base}${cleanPath}`;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Generates Schema.org BreadcrumbList JSON-LD object.
 */
export function generateBreadcrumbSchema(
  pathname: string,
  locale: string = "en",
  customBreadcrumbs?: BreadcrumbItem[],
) {
  const isEs = locale === "es";
  const homeLabel = isEs ? "Inicio" : "Home";
  const homePath = isEs ? "/es" : "/";

  let items: BreadcrumbItem[] = [];

  if (customBreadcrumbs && customBreadcrumbs.length > 0) {
    items = customBreadcrumbs;
  } else {
    // Always start with Home
    items.push({ name: homeLabel, path: homePath });

    const cleanPath = pathname.replace(/\/+$/, "");
    if (cleanPath && cleanPath !== "/" && cleanPath !== "/es") {
      // Determine page label based on common route patterns
      let pageLabel = "";

      if (cleanPath.endsWith("/calculator")) {
        pageLabel = isEs ? "Calculadora de Depósito" : "Deposit Recovery Calculator";
      } else if (cleanPath.endsWith("/about")) {
        pageLabel = isEs ? "Sobre Nosotros" : "About Us";
      } else if (cleanPath.endsWith("/contact")) {
        pageLabel = isEs ? "Contacto" : "Contact Us";
      } else if (cleanPath.endsWith("/privacy")) {
        pageLabel = isEs ? "Política de Privacidad" : "Privacy Policy";
      } else if (cleanPath.endsWith("/terms")) {
        pageLabel = isEs ? "Términos y Condiciones" : "Terms & Conditions";
      } else if (cleanPath.includes("-security-deposit-law")) {
        const stateSlug = cleanPath.split("/").pop()?.replace("-security-deposit-law", "").toUpperCase() || "";
        pageLabel = isEs
          ? `Ley de Depósito de Garantía (${stateSlug})`
          : `${stateSlug} Security Deposit Law & Tenant Rights`;
      } else {
        // Fallback: format slug from last path segment
        const segment = cleanPath.split("/").pop() || "";
        pageLabel = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      items.push({ name: pageLabel, path: cleanPath });
    }
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

/**
 * Generates dynamic Schema.org WebApplication JSON-LD identifying DepositRescue.
 */
export function generateWebApplicationSchema(
  canonicalUrl: string,
  description: string,
  locale: string = "en",
) {
  const isEs = locale === "es";
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: isEs
      ? "DepositRescue™ Calculadora de Recuperación de Depósito"
      : "DepositRescue™ Security Deposit Penalty Calculator",
    url: canonicalUrl,
    applicationCategory: "LegalApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
