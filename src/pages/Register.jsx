import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";


export default function Register(){


const urlReferralCode =
new URLSearchParams(window.location.search).get("ref");


const [referralInput,setReferralInput]=
useState(urlReferralCode || "");


const [referrerUserId,setReferrerUserId]=
useState(null);


const [savedReferrer,setSavedReferrer]=
useState(
localStorage.getItem("signup_referrer")
);


const [checkingReferral,setCheckingReferral]=
useState(false);


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [confirmPassword,setConfirmPassword]=useState("");


const [error,setError]=useState("");

const [loading,setLoading]=useState(false);


const [showOtp,setShowOtp]=useState(false);


const [otpCode,setOtpCode]=useState("");





const checkReferral = async()=>{


const code =
referralInput.trim().toUpperCase();



if(!code){

setReferrerUserId(null);

return null;

}



try{


setCheckingReferral(true);



const result =
await base44.entities.ReferralProfile.filter({

referral_code:code

});



if(result && result.length > 0){


const userId =
result[0].user_id;



setReferrerUserId(userId);



localStorage.setItem(
"signup_referrer",
userId
);



setSavedReferrer(userId);



setError("");



return userId;



}else{


setReferrerUserId(null);


setError(
"Geçersiz referans kodu."
);


return null;


}



}catch(err){


console.error(err);


setError(
"Referans kontrolü başarısız."
);


return null;



}finally{


setCheckingReferral(false);


}



};





useEffect(()=>{


if(urlReferralCode){

checkReferral();

}


},[]);
const handleSubmit = async(e)=>{


e.preventDefault();


setError("");



let validReferrer =
referrerUserId ||
savedReferrer ||
localStorage.getItem("signup_referrer");



if(!validReferrer){


validReferrer =
await checkReferral();


}



if(!validReferrer){


setError(
"Üyelik için geçerli referans kodu gereklidir."
);


return;


}




if(password !== confirmPassword){


setError(
"Şifreler eşleşmiyor."
);


return;


}



setLoading(true);



try{


await base44.auth.register({

email,
password

});


setShowOtp(true);



}catch(err){


setError(
err.message ||
"Kayıt oluşturulamadı."
);


}finally{


setLoading(false);


}


};







const handleGoogle = ()=>{


const finalReferrer =
referrerUserId ||
savedReferrer ||
localStorage.getItem("signup_referrer");



if(!finalReferrer){


setError(
"Google ile kayıt için önce referans kodu giriniz."
);


return;


}



base44.auth.loginWithProvider(

"google",

"/"

);



};








const handleVerify = async()=>{


setError("");



const finalReferrer =
referrerUserId ||
savedReferrer ||
localStorage.getItem("signup_referrer");



if(!finalReferrer){


setError(
"Referans bilgisi bulunamadı."
);


return;


}



setLoading(true);



try{


const result =
await base44.auth.verifyOtp({

email,

otpCode

});




if(result?.access_token){


base44.auth.setToken(
result.access_token
);


}




const currentUser =
await base44.auth.me();





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





const existing =
await base44.entities.ReferralProfile.filter({

user_id:
currentUser.id

});





if(!existing || existing.length===0){



await base44.entities.ReferralProfile.create({


user_id:
currentUser.id,



user_name:
currentUser.full_name ||
currentUser.email,



referral_code:
generatedCode,



referrer_user_id:
finalReferrer,



network_level:1,


level_1_count:0,

level_2_count:0,

level_3_count:0,


total_team:0,


team_volume:0,


subscription_active:true,


monthly_fee:100


});


}



localStorage.removeItem(
"signup_referrer"
);



window.location.href="/";



}catch(err){


console.error(err);



setError(
err.message ||
"Doğrulama başarısız."
);



}finally{


setLoading(false);


}



};







const handleResend = async()=>{


try{


await base44.auth.resendOtp(email);



toast({

title:"Kod gönderildi",

description:
"Yeni doğrulama kodu e-postana gönderildi."

});



}catch(err){


setError(
err.message ||
"Kod gönderilemedi."
);


}


};
if(showOtp){

return (

<AuthLayout

icon={Mail}

title="E-postanı doğrula"

subtitle={`${email} adresine doğrulama kodu gönderildi`}

>


{error &&

<div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">

{error}

</div>

}



<div className="flex justify-center">


<InputOTP

maxLength={6}

value={otpCode}

onChange={setOtpCode}

>


<InputOTPGroup>


{[0,1,2,3,4,5].map(i=>(

<InputOTPSlot

key={i}

index={i}

/>

))}


</InputOTPGroup>


</InputOTP>


</div>





<Button

className="w-full mt-6"

onClick={handleVerify}

disabled={

loading ||

otpCode.length < 6

}

>


{

loading ?

<>

<Loader2 className="w-4 h-4 mr-2 animate-spin"/>

Doğrulanıyor...

</>

:

"Doğrula"

}


</Button>




<button

className="w-full mt-4 text-sm text-primary"

onClick={handleResend}

>

Yeni kod gönder

</button>



</AuthLayout>

);


}







return (

<AuthLayout

icon={UserPlus}

title="Hesabını oluştur"

subtitle="Referans networküne katıl"


footer={

<>

Zaten hesabın var mı?

{" "}

<Link

to="/login"

className="text-primary"

>

Giriş yap

</Link>

</>

}

>





{error &&

<div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">

{error}

</div>

}






<Button

variant="outline"

className="w-full mb-6"

onClick={handleGoogle}

>


<GoogleIcon className="w-5 h-5 mr-2"/>


Google ile devam et


</Button>







<form

onSubmit={handleSubmit}

className="space-y-4"

>





<div>

<Label>

Referans Kodu

</Label>


<Input


value={referralInput}


disabled={Boolean(urlReferralCode)}


placeholder="Referans kodunuzu girin"



onChange={(e)=>{


setReferralInput(
e.target.value.toUpperCase()
);



setReferrerUserId(null);



}}


/>


<Button

type="button"

variant="secondary"

className="w-full mt-2"

disabled={checkingReferral}

onClick={checkReferral}

>


{

checkingReferral ?

"Kontrol ediliyor..."

:

"Referansı doğrula"

}


</Button>


</div>







<div>

<Label>Email</Label>


<Input

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

required

/>


</div>






<div>

<Label>Şifre</Label>


<Input

type="password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

required

/>


</div>






<div>

<Label>Şifre tekrar</Label>


<Input

type="password"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

required

/>


</div>






<Button

type="submit"

className="w-full h-12"

disabled={

loading ||

checkingReferral

}

>


{

loading ?

<>

<Loader2 className="w-4 h-4 mr-2 animate-spin"/>

Hesap oluşturuluyor...

</>

:

"Hesap oluştur"

}


</Button>




</form>



</AuthLayout>

);


}