import { LogOut, Loader2, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import useReferralDashboard from "@/hooks/useReferralDashboard";
import ReferralHero from "@/components/referral/ReferralHero";
import CreditOverview from "@/components/referral/CreditOverview";
import LevelGrid from "@/components/referral/LevelGrid";
import NetworkList from "@/components/referral/NetworkList";

export default function Home() {
  const { loading, user, profile, levels, transactions } = useReferralDashboard();
  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>;
  const memberCount = levels.reduce((sum, level) => sum + level.length, 0);
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-6xl px-4 py-5 md:px-8 md:py-8"><header className="mb-6 flex items-center justify-between"><div><p className="font-heading text-xl font-bold">DASHBOARD</p><p className="text-xs text-muted-foreground hidden">Aboneliğin büyüdükçe kredin büyür</p></div><div className="flex items-center gap-1">{user?.role === "admin" && <Button asChild variant="ghost" size="sm"><Link to="/admin"><Shield className="mr-2 h-4 w-4" />Yönetim</Link></Button>}<Button variant="ghost" size="sm" onClick={() => base44.auth.logout("/login")}><LogOut className="mr-2 h-4 w-4" />Çıkış</Button></div></header><div className="space-y-5"><ReferralHero code={profile.referral_code} /><CreditOverview transactions={transactions} memberCount={memberCount} /><LevelGrid counts={levels.map((level) => level.length)} /><NetworkList levels={levels} /><p className="pb-4 text-center text-xs text-muted-foreground">Krediler nakit olarak çekilemez; yalnızca abonelik ödemelerinde kullanılır.</p></div></div></main>;
}