import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const makeCode = () => `REF-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

export default function useReferralDashboard() {
  const [state, setState] = useState({ loading: true, user: null, profile: null, levels: [[], [], [], []], transactions: [] });

  useEffect(() => {
    const load = async () => {
      const user = await base44.auth.me();
      let profiles = await base44.entities.ReferralProfile.list();
      let profile = profiles.find((item) => item.user_id === user.id);
      if (!profile) {
        const refCode = new URLSearchParams(window.location.search).get("ref");
        const referrer = refCode ? profiles.find((item) => item.referral_code === refCode) : null;
        profile = await base44.entities.ReferralProfile.create({
          user_id: user.id,
          user_name: user.full_name || "Yeni üye",
          referral_code: makeCode(),
          referrer_user_id: referrer?.user_id || "",
        });
        profiles = [...profiles, profile];
        window.history.replaceState({}, "", "/");
      }

      const levels = [];
      let parentIds = [user.id];
      for (let level = 0; level < 4; level += 1) {
        const members = profiles.filter((item) => parentIds.includes(item.referrer_user_id));
        levels.push(members);
        parentIds = members.map((item) => item.user_id);
      }

      const transactions = await base44.entities.CreditTransaction.filter({ beneficiary_user_id: user.id });
      setState({ loading: false, user, profile, levels, transactions });
    };
    load();
  }, []);

  return state;
}