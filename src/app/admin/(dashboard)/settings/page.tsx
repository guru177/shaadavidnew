"use client";

import React, { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, SEO_PAGE_LABELS, type SeoPageKey, type SiteSettings } from "@/types/settings";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

type TabKey = "general" | "contact" | "social" | "seo" | "razorpay" | "ai" | "whatsapp";

const SEO_PAGE_KEYS = Object.keys(SEO_PAGE_LABELS) as SeoPageKey[];

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-[#29425e]/12 bg-white text-sm outline-none focus:ring-2 focus:ring-[#395c80]/20 focus:border-[#395c80]";
const labelClass = "block text-xs font-bold text-[#395c80]/80 uppercase tracking-wider mb-1.5";

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<TabKey>("general");
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [seoPageKey, setSeoPageKey] = useState<SeoPageKey>("home");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setForm({
            ...DEFAULT_SETTINGS,
            ...data,
            contact: { ...DEFAULT_SETTINGS.contact, ...data.contact },
            social: { ...DEFAULT_SETTINGS.social, ...data.social },
            seo: { ...DEFAULT_SETTINGS.seo, ...data.seo },
            seoPages: {
              ...DEFAULT_SETTINGS.seoPages,
              ...(data.seoPages || {}),
              ...Object.fromEntries(
                SEO_PAGE_KEYS.map((key) => [
                  key,
                  {
                    ...DEFAULT_SETTINGS.seoPages[key],
                    ...(data.seoPages?.[key] || {}),
                  },
                ])
              ),
            },
            razorpay: { ...DEFAULT_SETTINGS.razorpay, ...data.razorpay },
            aiTutor: { ...DEFAULT_SETTINGS.aiTutor, ...data.aiTutor },
            whatsappTemplates: {
              ...DEFAULT_SETTINGS.whatsappTemplates,
              ...data.whatsappTemplates,
              pending:
                data.whatsappTemplates?.pending || DEFAULT_SETTINGS.whatsappTemplates.pending,
              confirmed:
                data.whatsappTemplates?.confirmed || DEFAULT_SETTINGS.whatsappTemplates.confirmed,
              shipped:
                data.whatsappTemplates?.shipped || DEFAULT_SETTINGS.whatsappTemplates.shipped,
              delivered:
                data.whatsappTemplates?.delivered || DEFAULT_SETTINGS.whatsappTemplates.delivered,
              cancelled:
                data.whatsappTemplates?.cancelled || DEFAULT_SETTINGS.whatsappTemplates.cancelled,
              refunded:
                data.whatsappTemplates?.refunded || DEFAULT_SETTINGS.whatsappTemplates.refunded,
              signature:
                data.whatsappTemplates?.signature || DEFAULT_SETTINGS.whatsappTemplates.signature,
            },
          });
        }
      })
      .catch(() => setError("Failed to load settings"))
      .finally(() => setIsLoading(false));
  }, []);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = <
    S extends "contact" | "social" | "seo" | "razorpay" | "aiTutor" | "whatsappTemplates",
    K extends keyof SiteSettings[S],
  >(
    section: S,
    key: K,
    value: SiteSettings[S][K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setForm(data);
      setMessage("Settings saved. They apply across the site.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "general", label: "General" },
    { key: "contact", label: "Contact" },
    { key: "social", label: "Social" },
    { key: "seo", label: "SEO / OG" },
    { key: "razorpay", label: "Razorpay" },
    { key: "ai", label: "AI Tutor" },
    { key: "whatsapp", label: "WhatsApp templates" },
  ];

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Loading settings...</div>;
  }

  return (
    <div className="w-full space-y-5">
      <AdminPageHeader
        pill="ക്രമീകരണങ്ങൾ"
        title="Settings"
        subtitle="Manage contact info, SEO, payments, AI tutor keys, WhatsApp templates, and social links."
        actions={
          <button
            type="submit"
            form="settings-form"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save settings"}
          </button>
        }
      />

      <div className="bg-white rounded-[24px] border border-[#29425e]/08 shadow-[0_8px_30px_rgba(12,22,34,0.04)] overflow-hidden">
        <div className="px-4 sm:px-5 pt-3 border-b border-[#29425e]/8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`px-3.5 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 transition-colors ${
                  tab === t.key
                    ? "border-[#0c1622] text-[#0c1622] bg-[#F7F9FB]"
                    : "border-transparent text-gray-500 hover:text-[#0c1622] hover:bg-[#F7F9FB]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form id="settings-form" onSubmit={handleSave} className="p-5 sm:p-6 space-y-5">
          {tab === "general" && (
            <section className="space-y-4">
              <div>
                <label className={labelClass}>Site name</label>
                <input
                  className={inputClass}
                  value={form.siteName}
                  onChange={(e) => update("siteName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Site URL (for canonicals, OG &amp; track links)</label>
                <input
                  className={inputClass}
                  placeholder="https://www.shaadavids.com"
                  value={form.siteUrl}
                  onChange={(e) => update("siteUrl", e.target.value)}
                />
                {/localhost|127\.0\.0\.1/i.test(form.siteUrl || "") && (
                  <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                    WhatsApp / Facebook previews break if Site URL is localhost. Set this to your live domain
                    (e.g. https://www.shaadavids.com) and save.
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Tagline</label>
                <input
                  className={inputClass}
                  value={form.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                />
              </div>
            </section>
          )}

          {tab === "contact" && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={form.contact.email}
                  onChange={(e) => updateNested("contact", "email", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Phone (primary)</label>
                <input
                  className={inputClass}
                  placeholder="+917907075923"
                  value={form.contact.phone}
                  onChange={(e) => updateNested("contact", "phone", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Phone (secondary)</label>
                <input
                  className={inputClass}
                  value={form.contact.phoneSecondary}
                  onChange={(e) => updateNested("contact", "phoneSecondary", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>WhatsApp number</label>
                <input
                  className={inputClass}
                  placeholder="917907075923"
                  value={form.contact.whatsapp}
                  onChange={(e) => updateNested("contact", "whatsapp", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Digits with country code, e.g. 917907075923</p>
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address line 1</label>
                <input
                  className={inputClass}
                  value={form.contact.addressLine1}
                  onChange={(e) => updateNested("contact", "addressLine1", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address line 2</label>
                <input
                  className={inputClass}
                  value={form.contact.addressLine2}
                  onChange={(e) => updateNested("contact", "addressLine2", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  className={inputClass}
                  value={form.contact.city}
                  onChange={(e) => updateNested("contact", "city", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input
                  className={inputClass}
                  value={form.contact.state}
                  onChange={(e) => updateNested("contact", "state", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Pincode</label>
                <input
                  className={inputClass}
                  value={form.contact.pincode}
                  onChange={(e) => updateNested("contact", "pincode", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  className={inputClass}
                  value={form.contact.country}
                  onChange={(e) => updateNested("contact", "country", e.target.value)}
                />
              </div>
            </section>
          )}

          {tab === "social" && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(
                [
                  ["facebook", "Facebook URL"],
                  ["instagram", "Instagram URL"],
                  ["twitter", "X / Twitter URL"],
                  ["youtube", "YouTube URL"],
                  ["linkedin", "LinkedIn URL"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="md:col-span-2">
                  <label className={labelClass}>{label}</label>
                  <input
                    className={inputClass}
                    placeholder="https://"
                    value={form.social[key]}
                    onChange={(e) => updateNested("social", key, e.target.value)}
                  />
                </div>
              ))}
            </section>
          )}

          {tab === "seo" && (
            <section className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-[#0c1622]">Site-wide defaults</p>
                <div>
                  <label className={labelClass}>Default meta title</label>
                  <input
                    className={inputClass}
                    value={form.seo.title}
                    onChange={(e) => updateNested("seo", "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Default meta description</label>
                  <textarea
                    rows={3}
                    className={`${inputClass} resize-y`}
                    value={form.seo.description}
                    onChange={(e) => updateNested("seo", "description", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Default keywords (comma separated)</label>
                  <input
                    className={inputClass}
                    value={form.seo.keywords}
                    onChange={(e) => updateNested("seo", "keywords", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>OG title</label>
                  <input
                    className={inputClass}
                    value={form.seo.ogTitle}
                    onChange={(e) => updateNested("seo", "ogTitle", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>OG description</label>
                  <textarea
                    rows={2}
                    className={`${inputClass} resize-y`}
                    value={form.seo.ogDescription}
                    onChange={(e) => updateNested("seo", "ogDescription", e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>OG image path or URL</label>
                  <input
                    className={inputClass}
                    placeholder="/og-image.png"
                    value={form.seo.ogImage}
                    onChange={(e) => updateNested("seo", "ogImage", e.target.value)}
                  />
                  {form.seo.ogImage?.trim() && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        form.seo.ogImage.startsWith("http")
                          ? form.seo.ogImage
                          : form.seo.ogImage.startsWith("/")
                            ? form.seo.ogImage
                            : `/${form.seo.ogImage}`
                      }
                      alt="OG preview"
                      className="mt-3 max-h-40 w-auto rounded-xl border border-[#29425e]/10 bg-[#0c1622]/5 object-contain"
                    />
                  )}
                </div>
                <div>
                  <label className={labelClass}>Home canonical path</label>
                  <input
                    className={inputClass}
                    placeholder="/"
                    value={form.seo.canonicalPath}
                    onChange={(e) => updateNested("seo", "canonicalPath", e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Combined with Site URL. Example: / → {form.siteUrl.replace(/\/$/, "")}/
                  </p>
                </div>
              </div>

              <div className="border-t border-[#29425e]/8 pt-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#0c1622]">Per-page SEO</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Each public page has its own title, description, and keywords. Blog posts and
                    products also have separate SEO fields in their editors.
                  </p>
                </div>
                <div>
                  <label className={labelClass}>Page</label>
                  <select
                    className={inputClass}
                    value={seoPageKey}
                    onChange={(e) => setSeoPageKey(e.target.value as SeoPageKey)}
                  >
                    {SEO_PAGE_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {SEO_PAGE_LABELS[key]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Page title</label>
                  <input
                    className={inputClass}
                    value={form.seoPages[seoPageKey]?.title || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seoPages: {
                          ...prev.seoPages,
                          [seoPageKey]: {
                            ...prev.seoPages[seoPageKey],
                            title: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Page description</label>
                  <textarea
                    rows={3}
                    className={`${inputClass} resize-y`}
                    value={form.seoPages[seoPageKey]?.description || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seoPages: {
                          ...prev.seoPages,
                          [seoPageKey]: {
                            ...prev.seoPages[seoPageKey],
                            description: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Page keywords</label>
                  <input
                    className={inputClass}
                    value={form.seoPages[seoPageKey]?.keywords || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seoPages: {
                          ...prev.seoPages,
                          [seoPageKey]: {
                            ...prev.seoPages[seoPageKey],
                            keywords: e.target.value,
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {tab === "razorpay" && (
            <section className="space-y-4">
              <p className="text-sm text-gray-500">
                Keys saved here override <code className="text-xs bg-gray-100 px-1 rounded">.env</code> when
                set. Leave blank to keep using environment variables.
              </p>
              <div className="rounded-xl border border-[#29425e]/10 bg-[#F4F7FA] px-4 py-3 text-sm text-gray-600">
                Use Test Mode keys from the{" "}
                <a
                  href="https://dashboard.razorpay.com/app/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#395c80] underline"
                >
                  Razorpay dashboard
                </a>
                . Prefer storing secrets in <code className="text-xs bg-white px-1 rounded">.env.local</code>.
              </div>
              <div>
                <label className={labelClass}>Key ID (public)</label>
                <input
                  className={inputClass}
                  placeholder="rzp_test_ShaadavidLocal or rzp_test_…"
                  value={form.razorpay.keyId}
                  onChange={(e) => updateNested("razorpay", "keyId", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Key secret (server only)</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={form.razorpay.keySecret}
                  onChange={(e) => updateNested("razorpay", "keySecret", e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </section>
          )}

          {tab === "ai" && (
            <section className="space-y-4">
              <p className="text-sm text-gray-500">
                Powers the floating <strong>AI English Tutor</strong>. Keys saved here override{" "}
                <code className="text-xs bg-gray-100 px-1 rounded">.env</code> when set. Add at least one
                free key.
              </p>
              <div className="rounded-xl border border-[#29425e]/10 bg-[#F4F7FA] px-4 py-3 text-sm text-gray-600 space-y-1">
                <p>
                  Groq (recommended):{" "}
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#395c80] underline"
                  >
                    console.groq.com/keys
                  </a>
                </p>
                <p>
                  Gemini:{" "}
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#395c80] underline"
                  >
                    aistudio.google.com/apikey
                  </a>
                </p>
              </div>
              <div>
                <label className={labelClass}>Groq API key</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="gsk_…"
                  value={form.aiTutor?.groqApiKey || ""}
                  onChange={(e) => updateNested("aiTutor", "groqApiKey", e.target.value)}
                  autoComplete="new-password"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  {form.aiTutor?.groqApiKey?.trim()
                    ? `Saved (${form.aiTutor.groqApiKey.trim().slice(0, 6)}…)`
                    : "Not set — chat will try Gemini or .env next"}
                </p>
              </div>
              <div>
                <label className={labelClass}>Gemini API key</label>
                <input
                  type="password"
                  className={inputClass}
                  placeholder="AIza… (from Google AI Studio)"
                  value={form.aiTutor?.geminiApiKey || ""}
                  onChange={(e) => updateNested("aiTutor", "geminiApiKey", e.target.value)}
                  autoComplete="new-password"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  {form.aiTutor?.geminiApiKey?.trim()
                    ? `Saved (${form.aiTutor.geminiApiKey.trim().slice(0, 6)}…)`
                    : "Optional fallback — prefer keys starting with AIza"}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Clear a field and save to remove that key. Secrets are hidden from the public settings API.
              </p>
            </section>
          )}

          {tab === "whatsapp" && (
            <section className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                  Defaults are pre-filled. Placeholders:{" "}
                  <code className="text-xs bg-gray-100 px-1 rounded">
                    {"{{name}} {{orderId}} {{status}} {{productLine}} {{amountLine}} {{trackUrl}} {{siteName}} {{signature}}"}
                  </code>
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      whatsappTemplates: { ...DEFAULT_SETTINGS.whatsappTemplates },
                    }))
                  }
                  className="shrink-0 text-sm font-semibold text-[#395c80] hover:underline"
                >
                  Reset all to default
                </button>
              </div>

              {(
                [
                  { key: "pending", label: "Pending" },
                  { key: "confirmed", label: "Confirmed" },
                  { key: "shipped", label: "Shipped" },
                  { key: "delivered", label: "Delivered" },
                  { key: "cancelled", label: "Cancelled" },
                  { key: "refunded", label: "Refunded" },
                ] as const
              ).map((item) => {
                const value =
                  form.whatsappTemplates[item.key] ||
                  DEFAULT_SETTINGS.whatsappTemplates[item.key];
                const isDefault = value === DEFAULT_SETTINGS.whatsappTemplates[item.key];
                return (
                  <div key={item.key}>
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {item.label} template
                        {isDefault && (
                          <span className="ml-2 font-semibold normal-case tracking-normal text-emerald-600">
                            (default)
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateNested(
                            "whatsappTemplates",
                            item.key,
                            DEFAULT_SETTINGS.whatsappTemplates[item.key]
                          )
                        }
                        className="text-xs font-semibold text-[#395c80] hover:underline"
                      >
                        Use default
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      className={`${inputClass} resize-y font-mono text-[13px]`}
                      value={value}
                      onChange={(e) => updateNested("whatsappTemplates", item.key, e.target.value)}
                    />
                  </div>
                );
              })}

              <div>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Signature
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateNested(
                        "whatsappTemplates",
                        "signature",
                        DEFAULT_SETTINGS.whatsappTemplates.signature
                      )
                    }
                    className="text-xs font-semibold text-[#395c80] hover:underline"
                  >
                    Use default
                  </button>
                </div>
                <input
                  className={inputClass}
                  value={
                    form.whatsappTemplates.signature ||
                    DEFAULT_SETTINGS.whatsappTemplates.signature
                  }
                  onChange={(e) => updateNested("whatsappTemplates", "signature", e.target.value)}
                />
              </div>
            </section>
          )}

          {(message || error) && (
            <p className={`text-sm font-semibold ${error ? "text-rose-600" : "text-emerald-600"}`}>
              {error || message}
            </p>
          )}

          <div className="pt-2 border-t border-[#29425e]/8 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[linear-gradient(110deg,#29425e_0%,#395c80_30%,#0c1622_50%,#395c80_70%,#29425e_100%)] bg-[length:200%_auto] animate-shimmer shadow-[0_10px_30px_rgba(41,66,94,0.25)] hover:brightness-110 transition-all disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
