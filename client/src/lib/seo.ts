const SITE_URL = "https://www.theharvestwitta.com.au";
const DEFAULT_IMAGE = "/images/social/harvest-social-card.jpg";
const DEFAULT_IMAGE_ALT = "Milk crates stacked into a pavilion at The Harvest in Witta.";

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  image?: string;
  imageAlt?: string;
};

function absoluteUrl(value: string) {
  return new URL(value, SITE_URL).toString();
}

function pageUrl(path = "/") {
  const url = new URL(path, SITE_URL);
  url.hash = "";
  url.search = "";
  return url.toString();
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

export function setPageSeo({
  title,
  description,
  path = "/",
  type = "website",
  image = DEFAULT_IMAGE,
  imageAlt = DEFAULT_IMAGE_ALT,
}: PageSeo) {
  const url = pageUrl(path);
  const imageUrl = absoluteUrl(image);

  document.title = title;
  setCanonical(url);
  setMeta("name", "title", title);
  setMeta("name", "description", description);
  setMeta("property", "og:type", type);
  setMeta("property", "og:url", url);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:image", imageUrl);
  setMeta("property", "og:image:alt", imageAlt);
  setMeta("property", "twitter:card", "summary_large_image");
  setMeta("property", "twitter:url", url);
  setMeta("property", "twitter:title", title);
  setMeta("property", "twitter:description", description);
  setMeta("property", "twitter:image", imageUrl);
  setMeta("property", "twitter:image:alt", imageAlt);
}

export function setJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function clearJsonLd(id: string) {
  document.getElementById(id)?.remove();
}
