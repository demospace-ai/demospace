import { GoogleDriveIcon } from "@/assets/Icons";
import { Button } from "@/components/button/Button";
import { Divider } from "@/components/divider/Divider";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default async function Assets() {
  return (
    <div className="flex flex-col w-full h-full py-5 px-10">
      <h1 className="font-semibold text-2xl mb-4">Assets</h1>
      <div className="flex flex-col w-full h-full items-center justify-center border-2 border-dashed border-slate-200 rounded bg-slate-50 pb-20">
        <div className="flex flex-col items-center justify-center bg-white p-8 rounded-md shadow-sm border border-solid border-slate-200">
          <div className="rounded-full border border-solid border-slate-300 p-4 mb-4">
            <ArrowUpTrayIcon className="w-6 h-6 stroke-slate-600" />
          </div>
          <h2 className="text-lg font-semibold mb-1">Upload visual assets</h2>
          <div className="text-sm text-slate-600 mb-4 text-center font-light">
            <p>Maximum file size: 200MB</p>
            <p>Supported format: PDF, PPTX</p>
          </div>
          <Button>Browse files</Button>
          <Divider text="Or" className="my-5" />
          <Button secondary>
            <GoogleDriveIcon className="w-5 h-5" />
            Upload from Google Drive
          </Button>
        </div>
      </div>
    </div>
  );
}
