import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';

import PhoneInput from 'react-phone-input-2'
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import 'react-phone-input-2/lib/material.css'

type PhoneNumProps = {
  onSuccess: () => void,
  phonenum: string,
  setPhoneNum: (newPhoneNum: string) => void
};

export default function PhoneNum({ onSuccess, phonenum, setPhoneNum } : PhoneNumProps) {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onHandlePhoneNumChange = (newPhoneNum: string) => {
    setPhoneNum(newPhoneNum);
  };

  const handleSendCode = async () => {
    setLoading(true)
    setError(false);
    const { data, error: authError } = await supabase.auth.signInWithOtp({
      phone: phonenum,
    })
    
    if (authError) {
      setError(true);
      console.error(authError);
    }
    else {
      console.log('data', data);
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Box display='flex' flexDirection='column' margin={3}>
      <PhoneInput
        country={'us'}
        value={phonenum}
        onChange={onHandlePhoneNumChange}
      />

      <Button variant='contained' onClick={handleSendCode}>
        Send Code
      </Button>
      {loading && <LinearProgress/>}
      {error && <Alert severity='error'>There was an error sending the verification code!</Alert>}
    </Box>
  );
}