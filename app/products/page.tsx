import RecommendationForm from "@/components/RecommendationForm";
import MedicineCatalog from "@/components/MedicineCatalog";
import { getMedicinesFromExcel } from "@/lib/excel-medicines";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProductsPage() {
  const medicines = getMedicinesFromExcel();

  return (
    <section className="catalogPage">
      <div className="container">
        <div className="catalogHeader">
          <div className="sectionHeading">
            <p>Produk Apotek Kusuma Sari</p>

            <h1>
              Daftar Obat Non-Resep
            </h1>
          </div>

          <RecommendationForm />
        </div>

        <MedicineCatalog
          medicines={medicines}
        />
      </div>
    </section>
  );
}