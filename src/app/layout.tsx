import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { FeedStoreProvider } from "@/modules/feed/FeedStoreProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewsFeed",
  description: "An incremental front-end system design learning project.",
};

export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <div className="app-shell isolate">
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Header />
          <main id="main-content" className="page-content" tabIndex={-1}>
            <FeedStoreProvider>{children}</FeedStoreProvider>
          </main>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
