import { base44 } from "@/api/base44Client";


// Kullanıcıya özel referral kod üretir

export const generateReferralCode = (email)=>{


return (

email
.split("@")[0]
.toUpperCase()
.replace(/[^A-Z0-9]/g,"")
.substring(0,8)

+

Math.floor(
1000 + Math.random()*9000
)

);


};





// Kullanıcı kayıt sonrası network profili oluşturur

export const createUserReferralProfile = async(
user,
referrerUserId = null
)=>{


const existing =
await base44.entities.ReferralProfile.filter({

user_id:user.id

});



if(existing && existing.length > 0){

return existing[0];

}




const referralCode =
generateReferralCode(user.email);





const profile =

await base44.entities.ReferralProfile.create({

user_id:user.id,


user_name:
user.full_name ||
user.email,


referral_code:
referralCode,



// DAVET EDEN KİŞİ

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


};






// Davet linki oluşturur

export const getReferralLink=(code)=>{


return (

window.location.origin +

"/register?ref=" +

code

);


};