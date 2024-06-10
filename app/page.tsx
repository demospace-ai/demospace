import { Button } from "@/components/button/Button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default async function Home() {
  return (
    <div className="flex flex-col w-full h-full py-5 px-10">
      <h1 className="font-semibold text-2xl mb-4">Home</h1>
      <div className="flex flex-col w-full h-full items-center justify-center border-2 border-dashed border-slate-200 rounded bg-slate-50 pb-20">
        <div className="flex flex-col items-center justify-center bg-white p-16 rounded-md shadow-sm border border-solid border-slate-200">
          <h2 className="text-lg font-semibold mb-1">Welcome to Demospace!</h2>
          <p className="text-sm text-slate-600 mb-4 font-light">You don&apos;t have any demos in this workspace yet.</p>
          <Button>
            Create demo
            <PlusCircleIcon className="h-4 w-4 stroke-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
