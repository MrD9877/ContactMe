"use client";
import ButtonEmail from "@/components/ButtonEmail";
import PageLoading from "@/components/PageLoading";
import useFirebase from "@/firebase";
import { DocumentData } from "firebase-admin/firestore";
import { Auth, Unsubscribe } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, QuerySnapshot } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

const MessageSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type Message = z.infer<typeof MessageSchema>;

export default function Home() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>();
  const { auth, fireStoreDB } = useFirebase();

  const handleCollection = async (col: QuerySnapshot<DocumentData, DocumentData>) => {
    const msg: Message[] = [];
    for (let i = 0; i < col.docs.length; i++) {
      const doc = col.docs[i];
      const parse = await MessageSchema.parseAsync(doc.data())
        .then((data) => data)
        .catch();
      msg.push(parse);
    }
    console.log(msg);
    setMessages(msg);
  };

  const handleError = (err: unknown, router: AppRouterInstance, auth: Auth) => {
    if (auth.currentUser) {
      router.push("/goAdmin");
    } else router.push("/login");
  };

  useEffect(() => {
    let unsub: Unsubscribe;
    if (!fireStoreDB || !auth) return;
    try {
      const ref = collection(fireStoreDB, "messages");
      const q = query(ref, orderBy("createdAt", "desc"));
      unsub = onSnapshot(q, async (col) => await handleCollection(col));
    } catch (err) {
      handleError(err, router, auth);
    }

    return () => {
      unsub();
    };
  }, [router, fireStoreDB]);

  if (!auth || !messages) return <PageLoading />;
  return (
    <div>
      <main className="grid grid-rows-10 px-10 my-6 text-background">
        {messages?.map((item, index) => {
          return (
            <div key={index}>
              <div style={{ lineHeight: "100%" }} className="col-span-1 flex flex-col border-b-[1px] border-b-[var(--silverText)] py-3">
                <span>{item.name}</span>
                <ButtonEmail email={item.email} />
                <span className="text-silverTextSecondary text-sm">{item.message}</span>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
