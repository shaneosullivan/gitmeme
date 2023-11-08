import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import { Icon, Icons } from "next/dist/lib/metadata/types/metadata-types";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gitmeme",
  description: "Bring the joy of endless memes to Github",
  authors: [
    {
      name: "Shane O'Sullivan",
      url: "https://chofter.com",
    },
    {
      name: "Karolis Kosas",
      url: "https://karoliskosas.com",
    },
  ],
  creator: "@chofter",
  keywords: ["Github", "Gif", "Meme", "Gifs", "Memes"],
  icons: {
    icon: "/icons/icon-48x48.png",
    shortcut: ["/icons/icon-48x48.png"],
    apple: [],
    other: [],
  } as Icons,
  twitter: {
    card: "summary",
    creator: "@chofter",
    description: "Bring the joy of endless memes to Github",
    title: "GitMeme",
  },
  openGraph: {
    title: "GitMeme",
    url: "https://gitme.me",
    description: "Bring the joy of endless memes to Github",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header siteTitle={metadata.title as string} />
        <main>
          {children}
          <footer>
            © {new Date().getFullYear()}, Built by
            {` `}
            <a href="https://www.chofter.com" target="_blank">
              Shane O'Sullivan
            </a>{" "}
            and{" "}
            <a href="//karoliskosas.com" target="_blank">
              Karolis Kosas
            </a>
          </footer>
        </main>
        <script
          async
          defer
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
        <noscript>
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </body>
    </html>
  );
}
