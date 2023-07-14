import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type AnswerBoxProps = {
  text: string
  loading?: boolean
}

export default function AnswerBox({ text, loading=false } : AnswerBoxProps) {
  return (
    <Box sx={{ padding: '16.5px 14px', backgroundColor: 'primary.light', borderRadius: '4px' }}>
      {loading ? (
        <>
          <Skeleton animation="wave" width="75%"/>
          <Skeleton animation="wave" width="50%"/>
          <Skeleton animation="wave" width="35%"/>
        </>
      ) : (
        <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
          {text}
        </Typography>
      )}
    </Box>
  );
}