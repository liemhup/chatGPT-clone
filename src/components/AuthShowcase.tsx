import { signIn, signOut, useSession } from "next-auth/react";

function AuthShowcase() {
  const { data: sessionData } = useSession();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && (
          <div className="flex gap-2">
            <img
              src={sessionData.user?.image || ""}
              className="w-8"
              alt="user avatar"
            />
            <span>{sessionData.user?.name}</span>
          </div>
        )}
      </p>
      <button
        type="button"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
