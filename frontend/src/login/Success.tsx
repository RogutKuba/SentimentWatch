import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    if (router?.isReady) {
      router.push('/questions');
    }
  });

  return (
    <Typography variant="subtitle1">Logged in successfully!</Typography>
  )
}