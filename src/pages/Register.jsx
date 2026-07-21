import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";


export default function Register() {


const referralCode =
new URLSearchParams(window.location.search).get("ref");


const [referrerUserId,setReferrerUserId] =
useState(null);


const [checkingReferral,setCheckingReferral] =
useState(true);



const [email,setEmail] =
useState("");

const [password,setPassword] =
useState("");

const [confirmPassword,setConfirmPassword] =
useState("");


const [error,setError] =
useState("");


const [loading,setLoading] =
useState(false);


const [showOtp,setShowOtp] =
useState(false);


const [otpCode,setOtpCode] =
useState("");





useEffect(()=>{


const checkReferral = async()=>{


if(!referralCode){

setCheckingReferral(false);
return;

}



try{


const result =
await base44.entities.ReferralProfile.filter({

referral_code:
referralCode.toUpperCase()

});



if(result && result.length > 0){


setReferrerUserId(
result[0].user_id
);



}else{


setError(
"Geçersiz referans kodu."
);


}



}catch(err){


console.error(err);

setError(
"Referans kontrolü başarısız."
);



}finally{


setCheckingReferral(false);


}


};


checkReferral();



},[]);







const handleSubmit = async(e)=>{


e.preventDefault();


setError("");



if(!referrerUserId){


setError(
"Geçerli referans kodu gerekli."
);


return;


}



if(password !== confirmPassword){


setError(
"Şifreler eşleşmiyor"
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
"Kayıt oluşturulamadı"
);



}finally{


setLoading(false);


}



};









const handleVerify = async()=>{


setLoading(true);

setError("");



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







const existingProfile =
await base44.entities.ReferralProfile.filter({

user_id:
currentUser.id

});





if(!existingProfile ||
existingProfile.length===0){



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



}




window.location.href="/";



}catch(err){


console.error(err);


setError(
err.message ||
"Doğrulama başarısız"
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
"Yeni doğrulama kodu gönderildi."

});


}catch(err){


setError(
err.message
);


}


};









if(showOtp){


return(

<AuthLayout

icon={Mail}

title="E-postanı doğrula"

subtitle={`${email} adresine kod gönderildi`}

>


{error &&

<div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive">

{error}

</div>

}



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



<Button

className="w-full mt-6"

onClick={handleVerify}

disabled={
loading ||
otpCode.length<6
}

>


{loading ?

"Doğrulanıyor..."

:

"Doğrula"

}


</Button>



<button

className="mt-4 text-sm"

onClick={handleResend}

>

Yeni kod gönder

</button>



</AuthLayout>

);


}








if(!referralCode || !referrerUserId){


return(

<AuthLayout

icon={UserPlus}

title="Davet bağlantısı gerekli"

subtitle="Bu platform sadece referans ile üyelik kabul eder."

>


<p className="text-center text-sm">

Geçerli davet linki kullanmanız gerekiyor.

</p>


<Button

className="w-full mt-6"

asChild

>

<Link to="/login">

Giriş

</Link>

</Button>


</AuthLayout>


);


}









return(

<AuthLayout

icon={UserPlus}

title="Hesabını oluştur"

subtitle="Referans networküne katıl"


>


{error &&

<div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive">

{error}

</div>

}




<Button

variant="outline"

className="w-full mb-6"

onClick={()=>base44.auth.loginWithProvider("google","/")}

>

<GoogleIcon className="w-5 h-5 mr-2"/>

Google ile devam et

</Button>





<form

onSubmit={handleSubmit}

className="space-y-4"

>


<div>

<Label>Email</Label>

<Input

type="email"

value={email}

onChange={e=>setEmail(e.target.value)}

required

/>

</div>



<div>

<Label>Şifre</Label>

<Input

type="password"

value={password}

onChange={e=>setPassword(e.target.value)}

required

/>

</div>




<div>

<Label>Şifre tekrar</Label>

<Input

type="password"

value={confirmPassword}

onChange={e=>setConfirmPassword(e.target.value)}

required

/>

</div>



<Button

className="w-full"

disabled={
loading ||
checkingReferral
}

>


{loading ?

"Hesap oluşturuluyor..."

:

"Hesap oluştur"

}


</Button>


</form>



</AuthLayout>


);


}