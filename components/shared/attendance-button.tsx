"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  isSignedIn: boolean;
};

export function AttendanceButton({ isSignedIn }: Props) {
  const [signedIn, setSignedIn] = useState(isSignedIn);

  return (
    <Button
      size="lg"
      className="font-semibold bg-white hover:bg-blue-900 hover:text-white"
     
      onClick={() => setSignedIn(!signedIn)}
    >
      {signedIn ? "ATTENDANCE SIGN OFF" : "ATTENDANCE SIGN IN"}
    </Button>
  );
}
