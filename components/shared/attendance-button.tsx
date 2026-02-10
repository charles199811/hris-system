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
      className="bg-yellow-400 hover:bg-white text-black px-8 py-6 text-lg"
      onClick={() => setSignedIn(!signedIn)}
    >
      {signedIn ? "ATTENDANCE SIGN OFF" : "ATTENDANCE SIGN IN"}
    </Button>
  );
}
