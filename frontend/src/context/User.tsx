import React, { createContext, useState, useEffect, useContext } from "react";
import {
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

interface userType {
  user: any,
}

type ProviderProps = {
  children: React.ReactNode
}

export const UserContext = createContext<userType>({ user: null });


const Provider = ({ children } : ProviderProps) => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [user, setUser] = useState<any>({});

  // supabase.auth.onAuthStateChange(async () => {
  //   console.log("fetching user on auth state");
  //   const { data, error } = await supabase.auth.getSession();
    
  //   if (!error) setUser(data.user);
  // })

  useEffect(() => {
    updateUserData();
  }, []);

  const updateUserData = async () => {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error(error);
      return;
    }

    const { data: dbData, error: dbErorr } = await supabase
      .from("profile")
      .select();

    if (dbErorr) {
      console.error(dbErorr);
      return;
    }

    const userProfile = dbData[0];

    setUser({
      ...data.session?.user,
      profile: userProfile
    })
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser({});
    router.push("/");
  }

  const exposed = {
    user,
    logout,
  }

  return <UserContext.Provider value={exposed}>{children}</UserContext.Provider>
};

export const useUser = () => useContext(UserContext);

export default Provider;