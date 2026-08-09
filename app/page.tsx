import Link from "next/link";
import Logo from "@/components/Logo";

export default function HomePage() {
  return (
    <section className="heroSection">
      <div className="heroInner">
        <Logo variant="large" />

        <h1>
          Selamat Datang di <span>Kusuma Sari</span>
        </h1>

        <div className="heroActions">
          <Link href="/about" className="outlineButton">
            Pelajari Lebih Lanjut
          </Link>
          <Link href="/rekomendasi" className="solidButton">
            Cari Rekomendasi
          </Link>
        </div>
      </div>
    </section>
  );
}
