"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      theme="dark"
      toastOptions={{
        style: {
          background: "#18181B",
          border: "1px solid #27272A",
          color: "#FAFAFA"
        }
      }}
    />
  );
}
