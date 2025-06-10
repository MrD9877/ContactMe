"use client";
import ButtonEmail from "@/components/ButtonEmail";
import PageLoading from "@/components/PageLoading";
import useRealTimeMessages from "@/hooks/useRealTimeMessages";

export default function Home() {
  const { messages } = useRealTimeMessages();
  if (!messages) return <PageLoading />;
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
