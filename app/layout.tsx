import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kusuma Sari | Sistem Rekomendasi Obat Non-Resep",
  description:
    "Aplikasi rekomendasi obat non-resep berbasis Content-Based Filtering, TF-IDF, Cosine Similarity, Next.js, dan MySQL."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
