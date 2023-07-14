import { useState } from "react";
import Box from "@mui/material/Box";
import PhoneNum from "./PhoneNum";
import VerifyCode from "./VerifyCode";
import Success from "./Success";
import { useUser } from "../context/User";

enum STATUS {
  PHONE_NUM,
  VERIFY,
  SUCCESS,
};

export default function Otp() {
  const [phonenum, setPhoneNum] = useState('');
  const [status, setStatus] = useState(STATUS.PHONE_NUM);
  
  const { user } = useUser();

  console.log('user', user)

  const onSuccess = () => {
    setStatus(status + 1);
  }

  return (
    <Box>
      {status == STATUS.PHONE_NUM ? <PhoneNum phonenum={phonenum} setPhoneNum={setPhoneNum} onSuccess={onSuccess}/> :
      status == STATUS.SUCCESS ? <Success/> :
      <VerifyCode phonenum={phonenum} onSuccess={onSuccess}/>}
    </Box>
  )
};