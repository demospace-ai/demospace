import "@/app/globals.css";
import { NavBar } from "@/components/navigation/NavBar";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Demospace",
  description: "The AI-powered product expert that scales.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="flex w-full h-full">
          <NavBar />
          <div className="flex w-full h-screen">{children}</div>
        </main>
      </body>
    </html>
  );
}
