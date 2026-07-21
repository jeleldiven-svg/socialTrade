import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [networkProfile, setNetworkProfile] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);

  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [appPublicSettings, setAppPublicSettings] = useState(null);


  useEffect(() => {
    checkAppState();
  }, []);


  const checkAppState = async () => {

    try {

      setIsLoadingPublicSettings(true);
      setAuthError(null);


      const appClient = createAxiosClient({

        baseURL: `/api/apps/public`,

        headers:{
          'X-App-Id': appParams.appId
        },

        token: appParams.token,

        interceptResponses:true

      });


      try {


        const publicSettings =
          await appClient.get(
            `/prod/public-settings/by-id/${appParams.appId}`
          );


        setAppPublicSettings(publicSettings);


        if(appParams.token){

          await checkUserAuth();

        }
        else{

          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);

        }


        setIsLoadingPublicSettings(false);



      }catch(appError){


        console.error(appError);


        setAuthError({

          type:"unknown",

          message:
          appError.message || "Failed to load app"

        });


        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);


      }



    }catch(error){


      setAuthError({

        type:"unknown",

        message:error.message

      });


      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);


    }

  };





  const loadNetworkProfile = async(user)=>{

    try{


      const profiles =
      await base44.entities.ReferralProfile.filter({

        userId:user.id

      });


      if(profiles && profiles.length>0){

        setNetworkProfile(profiles[0]);

      }
      else{

        setNetworkProfile(null);

      }



    }catch(error){

      console.error(
        "Network profile error:",
        error
      );

      setNetworkProfile(null);

    }

  };





  const checkUserAuth = async()=>{


    try{


      setIsLoadingAuth(true);


      const currentUser =
      await base44.auth.me();



      setUser(currentUser);



      await loadNetworkProfile(
        currentUser
      );



      setIsAuthenticated(true);


      setIsLoadingAuth(false);

      setAuthChecked(true);



    }catch(error){


      console.error(
        "User auth failed",
        error
      );


      setUser(null);

      setNetworkProfile(null);

      setIsAuthenticated(false);

      setIsLoadingAuth(false);

      setAuthChecked(true);



      if(error.status===401 ||
         error.status===403){


        setAuthError({

          type:"auth_required",

          message:"Authentication required"

        });


      }


    }

  };





  const logout=(shouldRedirect=true)=>{


    setUser(null);

    setNetworkProfile(null);

    setIsAuthenticated(false);



    if(shouldRedirect){

      base44.auth.logout(
        window.location.href
      );

    }
    else{

      base44.auth.logout();

    }

  };





  const navigateToLogin=()=>{


    base44.auth.redirectToLogin(
      window.location.href
    );


  };



  const isAdmin =
    user?.role === "admin";




  return (

    <AuthContext.Provider value={{

      user,

      networkProfile,

      isAdmin,

      isAuthenticated,

      isLoadingAuth,

      isLoadingPublicSettings,

      authError,

      appPublicSettings,

      authChecked,

      logout,

      navigateToLogin,

      checkUserAuth,

      checkAppState

    }}>


      {children}


    </AuthContext.Provider>

  );


};




export const useAuth=()=>{


  const context =
  useContext(AuthContext);



  if(!context){

    throw new Error(
      "useAuth must be used within AuthProvider"
    );

  }


  return context;


};