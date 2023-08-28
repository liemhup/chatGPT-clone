import { api } from "~/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setChatId } from "~/store/chatSlice";
import { useRouter } from "next/router";

const SideBar = () => {
  const { data: sessionData } = useSession();
  const trpcUltil = api.useContext();
  const dispatch = useDispatch();
  const router = useRouter();
  const delChat = api.AskAi.deleteChat.useMutation({
    // update chat list without refetch
    onSuccess: (deletedChat) => {
      trpcUltil.AskAi.chats.setData(undefined, (oldData) => {
        if (oldData?.length === 0) return;
        const updatedChats = oldData?.filter(
          (chat) => chat.id !== deletedChat.id
        );
        if (updatedChats?.length === 0) router.push("/");
        return updatedChats;
      });
    },
  });
  const chats = api.AskAi.chats.useQuery();

  return (
    <div className="flex h-full flex-col bg-slate-700">
      <div>
        <button
          type="button"
          className="mx-auto my-2 flex w-4/5 rounded-md border-2  border-white p-1"
          onClick={() => {
            dispatch(setChatId(""));
            router.push("/");
            document.getElementById("messInput")?.focus();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="my-auto h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Chat
        </button>
        {chats.data && (
          <ol className="flex flex-col">
            {chats.data.map((chat) => (
              <li
                key={chat.id}
                className="group mx-2 flex justify-between rounded-md hover:bg-slate-400"
                onClick={() => dispatch(setChatId(chat.id))}
              >
                <button type="button" className="m-2 h-8 overflow-hidden p-2">
                  <Link href={`/chat/${chat.id}`} className="flex gap-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                    <span className="max-h-8">{chat.title}</span>
                  </Link>
                </button>
                <div className="hidden group-hover:flex">
                  <button
                    type="button"
                    title="edit chat title"
                    onClick={() => {
                      console.log("edit title");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="flex h-4 w-4 align-middle"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    title="delete chat"
                    onClick={() => {
                      delChat.mutate({ id: chat.id });
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="flex-grow"></div>
      <div className="hw-1/12 flex justify-between px-2 py-2">
        <div>{sessionData?.user.name}</div>
        <button type="button" title="nav" className="">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
