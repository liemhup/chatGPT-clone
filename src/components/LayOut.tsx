import SideBar from "./SideBar";
import MessageForm from "./MessageForm";
interface LayOutProps {
  children: React.ReactNode;
}
const LayOut: React.FC<LayOutProps> = ({ children }) => {
  return (
    <main className="flex w-screen text-white">
      <div className="fixed flex h-screen w-1/4 flex-col bg-slate-700 lg:w-1/6">
        <SideBar></SideBar>
      </div>
      <div className="ml-auto flex h-screen w-3/4 flex-col bg-slate-400 lg:w-5/6">
        <div className="fixed flex-grow overflow-scroll">{children}</div>
        <MessageForm />
      </div>
    </main>
  );
};

export default LayOut;
