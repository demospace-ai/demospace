import { Demi } from "@/components/assistant/Demi";
import { Footer } from "@/components/Footer";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm"></div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 w-full max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6 w-full h-full items-center">
          <h2 className="font-bold text-4xl mb-4 text-center">Demo</h2>
          <Demi />
        </main>
      </div>
      <Footer />
    </div>
  );
}
