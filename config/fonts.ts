import {
  Fira_Code as FontMono,
  Rubik,
  IBM_Plex_Sans_Arabic,
  Noto_Kufi_Arabic,
} from "next/font/google";

export const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
});

const rubik1 = Noto_Kufi_Arabic({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const ibmPlex = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-ibmPlex",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});
