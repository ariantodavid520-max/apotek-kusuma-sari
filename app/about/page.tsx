export default function AboutPage() {
  return (
    <section className="gradientPage">
      <div className="container aboutContainer">
        <div className="infoGrid">
          <article className="infoCard">
            <div className="iconCircle blueIcon">◎</div>
            <h2>Visi</h2>
            <p>
              Menjadi apotek terpercaya yang memberikan pelayanan kesehatan terbaik, berkualitas, dan mudah diakses oleh seluruh lapisan masyarakat.
            </p>
          </article>

          <article className="infoCard">
            <div className="iconCircle redIcon">❤</div>
            <h2>Misi</h2>
            <ul>
              <li>Menyediakan obat-obatan, vitamin, dan produk kesehatan yang lengkap, asli, dan berkualitas.</li>
              <li>Memberikan pelayanan yang ramah, cepat, dan profesional kepada setiap pelanggan.</li>
              <li>Menyediakan layanan konsultasi apoteker untuk membantu masyarakat memahami penggunaan obat secara tepat.</li>
            </ul>
          </article>
        </div>

        <article className="commitmentCard">
          <div className="iconCircle greenIcon">↝</div>
          <h2>Komitmen Kami</h2>
          <p>
            Kami berkomitmen untuk selalu memberikan pelayanan terbaik serta informasi produk kesehatan yang jelas. Sistem ini membantu proses pencarian awal, sedangkan keputusan penggunaan obat tetap harus mengikuti aturan pakai dan arahan tenaga kesehatan.
          </p>
        </article>
      </div>
    </section>
  );
}
