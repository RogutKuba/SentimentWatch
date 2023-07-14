import { useState } from 'react';
import type { AppProps } from 'next/app'
import Palette from '../src/utils/Palette'
import UserProvider from '../src/context/User';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export default function App({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <Palette>
      <SessionContextProvider
        supabaseClient={supabase}
      >
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </SessionContextProvider>
    </Palette>
  );
}
