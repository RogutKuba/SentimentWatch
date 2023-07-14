import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

type VerifyCodeProps = {
  onSuccess: () => void,
  phonenum: string
};

export default function VerifyCode({ onSuccess, phonenum }: VerifyCodeProps) {
  const supabase = useSupabaseClient();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleVerifyCode = async () => {
    setLoading(true)
    setError(false);
    const { data, error: authError } = await supabase.auth.verifyOtp({
      phone: phonenum,
      token: code,
      type: 'sms',
    })
    
    if (authError) {
      setError(true);
      console.error(authError);
    }
    else {
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <Box display='flex' flexDirection='column' margin={3}>
      <Typography variant='body1'>
        Enter the verification code sent to: +{phonenum}
      </Typography>
      <TextField
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder='Verification code...'
      />

      <Button variant='contained' onClick={handleVerifyCode}>
        Verify Code
      </Button>

      {loading && <LinearProgress/>}
      {error && <Alert severity='error'>There was an error verifying the verification code!</Alert>}
    </Box>
  );
}