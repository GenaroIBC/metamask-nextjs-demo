import "./globals.css";
import { Poppins } from "next/font/google";

export const metadata = {
  title: "MetaMask-NextJS demo",
  description: "A demo app integrating MetaMask",
};

const font = Poppins({
  weight: ["400"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className}>
      <body>{children}</body>
    </html>
  );
}
