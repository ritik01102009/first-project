"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

export function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
    { q: t("faq.q8"), a: t("faq.a8") },
    { q: t("faq.q9"), a: t("faq.a9") },
    { q: t("faq.q10"), a: t("faq.a10") },
    { q: t("faq.q11"), a: t("faq.a11") },
    { q: t("faq.q12"), a: t("faq.a12") },
    { q: t("faq.q13"), a: t("faq.a13") },
    { q: t("faq.q14"), a: t("faq.a14") },
    { q: t("faq.q15"), a: t("faq.a15") },
    { q: t("faq.q16"), a: t("faq.a16") },
    { q: t("faq.q17"), a: t("faq.a17") },
    { q: t("faq.q18"), a: t("faq.a18") },
    { q: t("faq.q19"), a: t("faq.a19") },
    { q: t("faq.q20"), a: t("faq.a20") },
    { q: t("faq.q21"), a: t("faq.a21") },
    { q: t("faq.q22"), a: t("faq.a22") },
    { q: t("faq.q23"), a: t("faq.a23") },
    { q: t("faq.q24"), a: t("faq.a24") },
    { q: t("faq.q25"), a: t("faq.a25") },
    { q: t("faq.q26"), a: t("faq.a26") },
    { q: t("faq.q27"), a: t("faq.a27") },
    { q: t("faq.q28"), a: t("faq.a28") },
    { q: t("faq.q29"), a: t("faq.a29") },
    { q: t("faq.q30"), a: t("faq.a30") },
  ];

  // Generate FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq, index) => ({
      "@type": "Question",
      name: faq.q,
      text: faq.a,
      position: index + 1,
    })),
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4 mt-8">
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
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200 pr-4">{faq.q}</span>
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

// Export the schema for use by the page
export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [],
};
