import { SitemapIcon } from "@/assets/Icons";
import { ArrowUpTrayIcon, LinkIcon } from "@heroicons/react/24/outline";

export default async function Knowledge() {
  return (
    <div className="flex flex-col w-full h-full py-5 px-10">
      <h1 className="font-semibold text-2xl mb-4">Knowledge</h1>
      <div className="flex flex-col w-full h-full items-center justify-center border-2 border-dashed border-slate-200 rounded bg-slate-50 pb-20">
        <div className="flex gap-10">
          <div className="flex flex-col items-center justify-center w-80 max-w-80 bg-white p-8 rounded-md shadow-sm border border-solid border-slate-200 cursor-pointer">
            <div className="rounded-full border border-solid border-slate-300 p-4 mb-4">
              <LinkIcon className="w-6 h-6 stroke-slate-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Add URL</h2>
            <p className="text-sm text-slate-600 mb-4 text-center font-light">Link to a single webpage</p>
          </div>
          <div className="flex flex-col items-center justify-center w-80 max-w-80 bg-white p-8 rounded-md shadow-sm border border-solid border-slate-200 cursor-pointer">
            <div className="rounded-full border border-solid border-slate-300 p-4 mb-4">
              <ArrowUpTrayIcon className="w-6 h-6 stroke-slate-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Upload File</h2>
            <p className="text-sm text-slate-600 mb-4 text-center font-light">
              Link to a single webpage to pull knowledge from
            </p>
          </div>
          <div className="flex flex-col items-center justify-center w-80 max-w-80 bg-white p-8 rounded-md shadow-sm border border-solid border-slate-200 cursor-pointer">
            <div className="rounded-full border border-solid border-slate-300 p-4 mb-4">
              <SitemapIcon className="w-6 h-6 stroke-slate-600" />
            </div>
            <h2 className="text-lg font-semibold mb-2">Add Sitemap</h2>
            <p className="text-sm text-slate-600 mb-4 text-center font-light">
              Link to an XML sitemap to scrape all content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
