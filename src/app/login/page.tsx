"use client";
import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";
import useFirebase from "@/firebase";
import PageLoading from "@/components/PageLoading";

export default function LoginPage() {
  const router = useRouter();
  const { auth } = useFirebase();

  const signInGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) throw Error("");
      const user = result.user;
      const token = await user.getIdToken();
      Cookies.set("token", token, { path: "/", secure: true, expires: 1 });
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };
  if (!auth) return <PageLoading />;
  return (
    <div className="h-screen w-screen flex justify-center items-center gap-4 flex-col py-4 overflow-clip">
      <Form signInGoogle={signInGoogle} auth={auth} />
    </div>
  );
}
