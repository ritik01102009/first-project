"use client";

import { Metadata, Viewport } from "next";
import { useLanguage } from "@/components/providers/language-provider";
import { useEffect } from "react";

export type SchemaType =
  | "WebPage"
  | "Article"
  | "FAQPage"
  | "HowToPage"
  | "BreadcrumbList"
  | "Organization";

export type OpenGraphType = {
  title: string;
  description: string;
  images: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  type: "website" | "article" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other";
  siteName?: string;
};

export type TwitterType = {
  card: "summary" | "summary_large_image" | "app";
  title?: string;
  description?: string;
  image?: string;
};

export const defaultViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const defaultMetadata: Metadata = {
  title: "",
  description: "",
  keywords: [],
};

export function usePageMetadata(
  options: {
    title?: string;
    description?: string;
    extraKeywords?: string[];
    canonical?: string;
    openGraph?: OpenGraphType;
    twitter?: {
      card: TwitterType["card"];
      title?: string;
      description?: string;
      image?: string;
    };
    schema?: {
      type: SchemaType;
      data: Record<string, unknown>;
    }[];
    viewport?: Partial<Viewport>;
  } = {}
) {
  const { t, language } = useLanguage();

  useEffect(() => {
    // Set document lang attribute
    document.documentElement.setAttribute("lang", language);

    // Update viewport
    const viewport: Viewport = {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
      ...options.viewport,
    };

    // Merge metadata
    const metadata: Metadata = {
      title: options.title
        ? `${options.title} | ${t("footer.brand_description")}`
        : t("footer.brand_description"),
      description: options.description || t("footer.brand_description"),
      keywords: [
        ...(options.extraKeywords || []),
        "debt payoff calculator",
        "budget tracker",
        language === "ja" ? "家計簿" : "budget app",
      ],
      openGraph: options.openGraph
        ? {
            title: options.openGraph.title,
            description: options.openGraph.description,
            images: options.openGraph.images,
            type: options.openGraph.type || "website",
            siteName: options.openGraph.siteName,
          }
        : {
            title: t("footer.brand_description"),
            description: t("footer.brand_description"),
            images: [
              {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: t("footer.brand_description"),
              },
            ],
            type: "website",
            siteName: t("footer.brand_description"),
          },
      twitter: options.twitter
        ? {
            card: options.twitter.card,
            title: options.twitter.title,
            description: options.twitter.description,
            images: options.twitter.image ? [options.twitter.image] : undefined,
          }
        : {
            card: "summary",
            title: t("footer.brand_description"),
            description: t("footer.brand_description"),
            images: ["/og-image.png"],
          },
    };

    // Add JSON-LD schemas
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    existingScripts.forEach((script) => script.remove());

    if (options.schema) {
      options.schema.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify(schema.data);
        document.head.appendChild(script);
      });
    }

    // Update HTML lang and viewport
    document.documentElement.setAttribute("lang", language);
    // Note: viewport is set in layout.tsx via the viewport constant

    // Apply metadata to page
    // Next.js metadata will be applied automatically via the metadata object
  }, [
    t,
    language,
    options.title,
    options.description,
    options.extraKeywords,
    options.openGraph,
    options.twitter,
    options.schema,
    options.viewport,
  ]);
}