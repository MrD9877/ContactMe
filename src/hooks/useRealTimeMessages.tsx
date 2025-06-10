import { DocumentData } from "firebase-admin/firestore";
import { Auth, Unsubscribe } from "firebase/auth";
import { collection, doc, onSnapshot, orderBy, query, QuerySnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useEffect, useState } from "react";
import { z } from "zod";
import useFirebase from "@/hooks/usefirebase";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MessageSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

type Message = z.infer<typeof MessageSchema>;

export default function useRealTimeMessages() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>();
  const { auth, fireStoreDB } = useFirebase();

  const handleCollection = async (col: QuerySnapshot<DocumentData, DocumentData>) => {
    if (!auth || !auth.currentUser || !fireStoreDB) return;
    const msg: Message[] = [];
    for (let i = 0; i < col.docs.length; i++) {
      const doc = col.docs[i];
      const parse = await MessageSchema.parseAsync(doc.data())
        .then((data) => data)
        .catch((error) => {
          if (error instanceof Error) toast(`Error ${error.message}`);
          else toast("error try again");
        });
      if (parse) msg.push(parse);
    }
    setMessages(msg);
    try {
      await updateDoc(doc(fireStoreDB, "users", auth.currentUser.uid), {
        lastSeen: serverTimestamp(),
      });
    } catch {
      toast("error:Unable to update last seen");
    }
  };

  const handleError = (err: unknown, router: AppRouterInstance, auth: Auth) => {
    if (auth.currentUser) {
      toast("error:You are not a Admin go admin");
      router.push("/goAdmin");
    } else router.push("/login");
    toast("error:Please Login Or check connection");
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
  }, [router, fireStoreDB, auth]);

  return { messages } as const;
}
