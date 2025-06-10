"use client";
import { Skeleton } from "@/components/Skeleton";
import React from "react";

export default function FormLoading() {
  return (
    <div className="h-screen w-screen flex justify-center items-center gap-4 flex-col py-4 overflow-clip">
      <Skeleton className="w-[20vw] h-[60vh]" />;
    </div>
  );
}
