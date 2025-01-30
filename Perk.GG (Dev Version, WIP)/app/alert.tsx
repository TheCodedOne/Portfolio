"use client";

import { useEffect, useState } from "react";

export default function Alert() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasClosedAlert = localStorage.getItem("hasClosedAlert");
    if (!hasClosedAlert) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hasClosedAlert", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 px-6 pb-6">
      <div className="pointer-events-auto ml-auto max-w-xl rounded-xl bg-destructive/5 p-6 shadow-lg ring-1 ring-destructive/50">
        <p className="mb-1 text-lg font-semibold text-destructive">
          BETA WARNING
        </p>
        <p className="text-sm/6 text-destructive">
          This is a beta version of Perk.
        </p>
        <p className="text-sm/6 text-destructive">
          Features may be incomplete or unstable. Use at your own risk.
        </p>
        <p className="text-sm/6 text-destructive">
          By continuing, you acknowledge that you understand the risks involved.
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center justify-center rounded-md bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            I understand
          </button>
        </div>
      </div>
    </div>
  );
}
