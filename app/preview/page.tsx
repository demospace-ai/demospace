import { Demi } from "@/components/assistant/Demi";

export default async function Preview() {
  return (
    <div className="flex flex-col w-full h-full py-5 px-10">
      <h1 className="font-semibold text-2xl mb-4">Preview</h1>
      <Demi />
    </div>
  );
}
