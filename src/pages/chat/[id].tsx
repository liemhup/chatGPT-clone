import { useRouter } from "next/router";
// import { useState } from "react";
import LayOut from "~/components/LayOut";
import { api } from "~/utils/api";

const ChatById = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log("query", router.query);
  // const [chats,setChats] = useState()
  if (typeof id !== "string") return <h1>Error</h1>;
  const chats = api.AskAi.chatById.useQuery({ id });
  if (chats.data == null) return;
  return (
    <LayOut>
      <ol className="overflow-y-scroll">
        {chats.data?.messages.map((mess) => {
          return (
            <li
              key={mess.id}
              className={`${mess.role === "user" ? "bg-slate-600" : ""}`}
            >
              <p className="mx-auto flex w-4/5 md:w-2/3">
                <span>{mess.role}</span>: {mess.content}
              </p>
            </li>
          );
        })}
      </ol>
    </LayOut>
  );
};

export default ChatById;
