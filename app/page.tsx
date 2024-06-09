import { Demi } from "@/components/assistant/Demi";

export default async function Index() {
  return (
    <div className="flex flex-1 flex-col gap-6 w-full h-full items-center justify-center pb-64">
      <h2 className="font-bold text-4xl mb-4 text-center">Demo</h2>
      <Demi />
    </div>
  );
}
