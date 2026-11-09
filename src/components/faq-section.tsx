"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rawFaqs = Array.from({ length: 30 }, (_, i) => {
    const qKey = `faq.q${i + 1}`;
    const aKey = `faq.a${i + 1}`;
    const q = t(qKey);
    const a = t(aKey);
    return { q, a, qKey, aKey };
  });

  // Filter out any missing/untranslated keys
  const faqs = rawFaqs.filter(
    (faq) =>
      Boolean(faq.q && faq.a) &&
      faq.q !== faq.qKey &&
      faq.a !== faq.aKey &&
      !faq.q.startsWith("faq.")
  );

  // Generate FAQPage schema for Google Search
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq, index) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
      position: index + 1,
    })),
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4 mt-8" id="faq">
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex items-center justify-center gap-2 mb-8">
        <HelpCircle className="w-6 h-6 text-emerald-500" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {t("faq.title")}
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 pr-4 text-base">
                {faq.q}
              </h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 pt-2 text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [],
};
