import React, { useRef } from "react";
import CopyButtonComponent, { ChildRef } from "@/components/CopyButton";
import { useRouter } from "next/navigation";

export default function ButtonEmail({ email }: { email: string }) {
  const childRef = useRef<ChildRef>(null);
  const router = useRouter();
  const handleCopy = (text: string) => {
    childRef.current?.trigger(text);
  };

  const replyEmail = () => {
    router.push(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${"Reply to your message"}&body=hi`);
  };

  return (
    <button onClick={() => handleCopy(email)} className="text-sm mb-2 flex  items-center w-fit relative gap-2 mt-1">
      <CopyButtonComponent ref={childRef} width={20} height={20} />
      <span className="w-[20px] height-[20px]"></span>
      <span onClick={replyEmail}>{email}</span>
    </button>
  );
}
