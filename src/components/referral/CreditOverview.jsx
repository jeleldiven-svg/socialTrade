import { CreditCard, Users } from "lucide-react";

export default function CreditOverview({ transactions, memberCount }) {
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);
  const currentPeriod = new Date().toISOString().slice(0, 7);
  const monthly = transactions.filter((item) => item.period === currentPeriod).reduce((sum, item) => sum + item.amount, 0);
  const cards = [
    { label: "Kullanılabilir kredi", value: `$${total.toFixed(2)}`, note: "Yalnızca abonelikte", icon: CreditCard },
    { label: "Bu ay kazanılan", value: `$${monthly.toFixed(2)}`, note: "Otomatik işlendi", icon: CreditCard },
    { label: "Network", value: memberCount, note: "4 seviyedeki üyeler", icon: Users },
  ];
  return <section className="grid gap-3 sm:grid-cols-3">{cards.map(({ label, value, note, icon: Icon }) => <article key={label} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="mb-4 flex items-center justify-between text-muted-foreground"><span className="text-sm">{label}</span><Icon className="h-4 w-4" /></div><strong className="font-heading text-3xl">{value}</strong><p className="mt-1 text-xs text-muted-foreground">{note}</p></article>)}</section>;
}