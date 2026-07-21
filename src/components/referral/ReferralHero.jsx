import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReferralHero({ code }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/register?ref=${code}`;
  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg md:p-8">
    <div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-primary-foreground/15 p-2"><Share2 className="h-5 w-5" /></span><div><p className="text-sm opacity-75">Referans kodun</p><h1 className="font-heading text-2xl font-bold tracking-tight">{code}</h1></div></div>
    <p className="mb-5 max-w-xl text-sm leading-6 opacity-80">Linkini paylaş; dört seviyeye kadar aktif aboneliklerden her ay abonelik kredisi kazan.</p>
    <div className="flex flex-col gap-2 rounded-2xl bg-background/10 p-2 sm:flex-row"><div className="min-w-0 flex-1 truncate px-3 py-2 text-sm">{link}</div><Button onClick={copyLink} variant="secondary" className="shrink-0">{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}{copied ? "Kopyalandı" : "Linki kopyala"}</Button></div>
  </section>;
}