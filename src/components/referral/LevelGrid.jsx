const levels = [
{ level: 1, rate: "%2,5", text: "Doğrudan davet" },
{ level: 2, rate: "%1,5", text: "Arkadaşının daveti" },
{ level: 3, rate: "%1", text: "Üçüncü halka" },
{ level: 4, rate: "%0,50", text: "Dördüncü halka" }];


export default function LevelGrid({ counts }) {
  return <section><div className="mb-4"><h2 className="font-heading text-xl font-semibold">Kazanç planı</h2><p className="text-sm text-muted-foreground">Her aktif üye (aylık abonelik için)</p></div><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{levels.map((item, index) => <article key={item.level} className="rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md"><div className="mb-5 flex items-center justify-between"><span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{item.level}. Seviye</span><span className="text-xs text-muted-foreground">{counts[index]} üye</span></div><p className="font-heading text-2xl font-bold text-primary">{item.rate}</p><p className="mt-1 text-xs text-muted-foreground">{item.text}</p></article>)}</div></section>;
}