'use client';

import { useState, useEffect } from "react";

export function Greeting({ username }: { username: string }) {
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <h1 className="text-4xl font-heading font-semibold text-foreground transition-all duration-500 ease-in-out">
      {greeting}, {username}.
    </h1>
  );
}
