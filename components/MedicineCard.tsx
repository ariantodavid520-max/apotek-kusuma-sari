import type { MedicineRecord } from "@/types/medicine";
import { formatRupiah } from "@/lib/format";

type MedicineCardProps = {
  medicine: MedicineRecord;
  compact?: boolean;
};

export default function MedicineCard({
  medicine,
  compact = false
}: MedicineCardProps) {
  return (
    <article
      className={`medicineCard ${
        compact ? "compactCard" : ""
      }`}
    >
      <div className="medicineImageWrap">
        <img
          src={
            medicine.imageUrl ||
            "/images/medicine-placeholder.svg"
          }
          alt={`Ilustrasi ${medicine.name}`}
          className="medicineImage"
        />
      </div>

      <div className="medicineContent">
        <p className="medicineGroup">
          {medicine.category ||
            "Kategori tidak tersedia"}
        </p>

        <h3>{medicine.name}</h3>

        <p className="medicineCategory">
          <strong>Indikasi:</strong>{" "}
          {medicine.indication ||
            "Tidak dicantumkan"}
        </p>

        <p className="medicineAge">
          <strong>Ketentuan usia:</strong>{" "}
          {medicine.age ||
            "Tidak dicantumkan"}
        </p>

        <p className="medicineSymptoms">
          <strong>
            Riwayat penyakit dilarang:
          </strong>{" "}
          {medicine.forbiddenDiseaseHistory ||
            "Tidak ada"}
        </p>

        <p className="medicinePrice">
          {formatRupiah(medicine.price)}
        </p>
      </div>
    </article>
  );
}