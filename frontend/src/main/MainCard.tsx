import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import InputArea from './InputArea';
import AnswerBox from './AnswerBox';
import Stack from '@mui/material/Stack';
import QuestionBox from './QuestionBox';
import { useUser } from '../context/User';

const exText = 'Welcome to Homework Helper!\n\nOur service is designed to help students with their homework. We provide a variety of resources and tools to help you with your homework.\n\nTo get started, simply type your question into the text box below and if you have any further questions, please feel free to contact us.'
const exQuestion = 'A car averages 27 miles per gallon. If gas costs $4.04 per gallon, which of the following is closest to how much the gas would cost for this car to travel 2,727 typical miles?';

export default function MainCard() {
  return (
    <Card sx={{ width: '100%', padding: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Stack spacing={2}>
        <AnswerBox text={exText}/>
        <QuestionBox text={exQuestion}/>
        <AnswerBox text={exText} loading/>
      </Stack>
      
      <InputArea/>
    </Card>    
  );
}