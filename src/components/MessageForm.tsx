import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChatId } from "~/store/chatSlice";
import { api } from "~/utils/api";
import { useQueryClient } from "@tanstack/react-query";
type StateType = {
  chat: string;
};

const MessageForm = () => {
  const [message, setMes] = useState<string>("");
  const newMess = api.AskAi.askAi.useMutation();
  const router = useRouter();
  const chatId = useSelector((state: StateType) => state.chat);
  const dispatch = useDispatch();
  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (newMess.error) {
      console.log(newMess.error);
      return;
    }
    newMess.mutate(
      {
        message: message,
        chatId: chatId || undefined,
      },
      {
        onSuccess: (data) => {
          router.push(`/chat/${data?.id}`);
          dispatch(setChatId(data?.id));
          
        },
      }
    );
    // test.mutate();
    setMes("");
  };

  return (
    <div className="fixed bottom-0 flex h-1/6 w-3/4 bg-slate-600 md:w-5/6">
      <div
        className="relative m-auto w-2/3 rounded-2xl border-solid
            border-slate-600"
      >
        <form id="form" onSubmit={handleSubmit}>
          <div className="shadow-xs relative flex w-full flex-grow flex-col rounded-xl border-0 bg-slate-500 py-[10px] md:py-4 md:pl-4">
            <textarea
              onChange={(event) => {
                setMes(event.currentTarget.value);
              }}
              id="messInput"
              value={message}
              tabIndex={0}
              rows={1}
              className="my-auto max-h-40 w-full resize-none overflow-y-hidden
                    rounded-2xl border-0 bg-transparent p-2
                     pl-3 pr-10 align-middle placeholder:text-slate-100
                     focus:outline-none md:pl-0 md:pr-12"
              placeholder="Câu hỏi của bạn"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            ></textarea>
            <button
              title="Submit"
              type="submit"
              disabled={message === "" ? true : false}
              className="absolute right-0 top-1/2 mr-2 -translate-y-1/2 rounded-md p-1
                     text-white transition-colors enabled:bg-green-500
                      disabled:text-gray-400 
                      disabled:opacity-40 md:right-3 md:p-2 "
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="m-1 h-4 w-4 md:m-0 lg:h-6 lg:w-6"
                  strokeWidth="2"
                >
                  <path
                    d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </span>
            </button>
            {/* <button onClick={() => signIn()}>sign in</button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
