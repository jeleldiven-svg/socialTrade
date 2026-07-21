import { base44 } from "@/api/base44Client";

export const LEVEL_RATES = [0.025, 0.015, 0.01, 0.005];

export function getUpline(member, profiles) {
  const upline = [];
  let currentReferrer = member.referrer_user_id;
  for (let i = 0; i < 4 && currentReferrer; i += 1) {
    const referrerProfile = profiles.find((p) => p.user_id === currentReferrer);
    if (!referrerProfile) break;
    upline.push({ user_id: referrerProfile.user_id, user_name: referrerProfile.user_name, level: i + 1, rate: LEVEL_RATES[i] });
    currentReferrer = referrerProfile.referrer_user_id;
  }
  return upline;
}

export async function distributeInvestmentCredits(member, amount, profiles, period) {
  const upline = getUpline(member, profiles);
  const transactions = upline.map((u) => ({
    beneficiary_user_id: u.user_id,
    source_user_id: member.user_id,
    source_name: member.user_name,
    level: u.level,
    amount: Number((amount * u.rate).toFixed(2)),
    period,
    status: "investment_credit",
  }));
  if (transactions.length) return base44.entities.CreditTransaction.bulkCreate(transactions);
  return [];
}