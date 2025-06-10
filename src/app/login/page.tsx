"use client";
import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";
import useFirebase from "@/hooks/usefirebase";
import FormLoading from "@/components/LoadingForm";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { auth, fireStoreDB } = useFirebase();
  const [disable, setDisable] = useState(false);

  const makeUserAdmin = async (key: string) => {
    setDisable(true);
    if (!auth || !fireStoreDB) return;
    const user = auth.currentUser;
    const id = user?.uid;
    if (!id) return router.push("/login");
    try {
      await setDoc(doc(fireStoreDB, "users", id), {
        role: "admin",
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        key,
      });
    } catch (error) {
      if (error instanceof Error) toast(`Error ${error.message}`);
      else toast("error try again");
    } finally {
      setDisable(false);
    }
  };

  const signInGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) throw Error("No Credential found");
      const user = result.user;
      const token = await user.getIdToken();
      Cookies.set("token", token, { path: "/", secure: true, expires: 1 });
      router.push("/");
    } catch (error) {
      if (error instanceof Error) toast(`Error ${error.message}`);
      else toast("error try again");
    }
  };
  if (!auth) return <FormLoading />;
  return (
    <div className="h-screen w-screen flex justify-center items-center gap-4 flex-col py-4 overflow-clip">
      <Form signInGoogle={signInGoogle} auth={auth} makeUserAdmin={makeUserAdmin} disable={disable} />
    </div>
  );
}
