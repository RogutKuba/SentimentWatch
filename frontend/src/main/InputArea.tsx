import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

export default function InputArea() {
  return (
    <Grid
      direction="column"
      container
    >
      <TextField
        multiline
        minRows={7}
        placeholder='Enter your questions here...'
        sx={{ width: '100%' }}
      />
      <Grid width="100%" sx={{ marginTop: 2, alignItems: 'center' }}>
        <Button variant="contained">
          Submit
        </Button>

        <Chip label='5/5 Daily Uses Left' sx={{ marginLeft: 1 }}/>
      </Grid>
    </Grid>
  );
};