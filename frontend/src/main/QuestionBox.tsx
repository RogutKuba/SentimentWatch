import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type QuestionBoxProps = {
  text: string
}

export default function QuestionBox({ text } : QuestionBoxProps) {
  return (
    <Box sx={{ padding: '16.5px 14px', borderRadius: '4px', backgroundColor: 'rgba(0, 0, 0, 0.08)' }}>
      <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
        {text}
      </Typography>
    </Box>
  );
}