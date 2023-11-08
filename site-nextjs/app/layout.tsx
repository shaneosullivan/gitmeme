import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gitmeme",
  description: "Bring the joy of endless memes to Github",
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
      </body>
    </html>
  );
}
