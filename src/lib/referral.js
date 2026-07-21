import { base44 } from "@/api/base44Client";


export async function createUserReferralProfile(
    currentUser,
    referrerUserId
){

    try {


        // Daha önce oluşturulmuş mu?
        const existing =
        await base44.entities.ReferralProfile.filter({

            user_id: currentUser.id

        });


        if(existing && existing.length > 0){

            return existing[0];

        }



        // Yeni referral kodu üret

        const generatedCode =

            currentUser.email
            .split("@")[0]
            .toUpperCase()
            .replace(/[^A-Z0-9]/g,"")
            .slice(0,8)

            +

            Math.floor(
                1000 +
                Math.random()*9000
            );





        // Referral profil oluştur

        const profile =

        await base44.entities.ReferralProfile.create({

            user_id:
            currentUser.id,


            user_name:
            currentUser.full_name ||
            currentUser.email,


            referral_code:
            generatedCode,


            referrer_user_id:
            referrerUserId,



            network_level:1,


            level_1_count:0,


            level_2_count:0,


            level_3_count:0,


            total_team:0,


            team_volume:0,


            subscription_active:true,


            monthly_fee:100


        });



        return profile;



    } catch(error){


        console.error(
            "Referral profile error:",
            error
        );


        throw error;


    }


}