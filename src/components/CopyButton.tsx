"use client";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { CircleCheck, Copy } from "lucide-react";
import React, { useRef, useImperativeHandle, forwardRef } from "react";

export type ChildRef = {
  trigger: (r: string) => void;
};
export type ChildProps = {
  width: number;
  height: number;
};

function CopyButton(props: ChildProps, ref: React.Ref<ChildRef>) {
  void props;
  const copyRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const triggerAnimation = () => {
    // Animate check icon in
    if (copyRef.current) {
      copyRef.current.classList.remove("fade-in"); // reset if needed
      void copyRef.current.offsetWidth; // force reflow
      copyRef.current.classList.add("fade-in");
    }

    // Animate copy icon out
    if (iconRef.current) {
      iconRef.current.classList.remove("fade-out");
      void iconRef.current.offsetWidth;
      iconRef.current.classList.add("fade-out");
    }
  };

  useImperativeHandle(ref, () => ({
    trigger(text: string) {
      copyToClipboard(text);
      triggerAnimation();
    },
  }));

  return (
    <>
      {/* <div className={`h-[${props.height}px] w-[${props.width}px] relative`}> */}
      <span ref={copyRef} className=" opacity-0 absolute top-0 z-5">
        <CircleCheck width={props.width} height={props.height} stroke="green" />
      </span>
      <span ref={iconRef} className="  absolute z-15 top-0">
        <Copy width={props.width} height={props.height} />
      </span>
      {/* </div> */}
    </>
  );
}

const CopyButtonComponent = forwardRef<ChildRef, ChildProps>(CopyButton);

export default CopyButtonComponent;
