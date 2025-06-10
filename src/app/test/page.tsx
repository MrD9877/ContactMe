"use client";
import React from "react";
import { toast } from "sonner";

export default function Page() {
  return (
    <div>
      <button onClick={() => toast("working")}>Click</button>
    </div>
  );
}
