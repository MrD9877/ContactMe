"use client";
import { Skeleton } from "@/components/Skeleton";
import React from "react";

export default function PageLoading() {
  const arr = new Array(10).fill("");
  return (
    <div className="h-screen w-screen flex justify-center items-center gap-4 flex-col py-4 overflow-clip">
      {arr.map((i, index) => {
        return <Skeleton key={index} className="w-[80vw] h-[10vh]" />;
      })}
    </div>
  );
}
