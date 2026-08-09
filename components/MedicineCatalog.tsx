"use client";

import { useState } from "react";
import MedicineCard from "@/components/MedicineCard";
import type { MedicineRecord } from "@/types/medicine";

type MedicineCatalogProps = {
  medicines: MedicineRecord[];
};

const ITEMS_PER_LOAD = 8;

export default function MedicineCatalog({
  medicines
}: MedicineCatalogProps) {
  const [visibleCount, setVisibleCount] =
    useState(ITEMS_PER_LOAD);

  const visibleMedicines =
    medicines.slice(0, visibleCount);

  const hasMore =
    visibleCount < medicines.length;

  const canToggleAll =
    medicines.length > ITEMS_PER_LOAD;

  const isShowingAll =
    canToggleAll &&
    visibleCount >= medicines.length;

  function showMoreMedicines() {
    setVisibleCount((currentCount) =>
      Math.min(
        currentCount + ITEMS_PER_LOAD,
        medicines.length
      )
    );
  }

  // BAGIAN B DILETAKKAN DI SINI
  function showAllMedicines() {
    setVisibleCount(medicines.length);
  }

  function collapseMedicines() {
    setVisibleCount(ITEMS_PER_LOAD);
  }

  return (
    <>
      <div
        className="resultSummary"
        aria-live="polite"
      >
        Menampilkan{" "}
        {visibleMedicines.length} dari{" "}
        {medicines.length} data obat.
      </div>

      <div className="productGrid">
        {visibleMedicines.map((medicine) => (
          <MedicineCard
            key={medicine.id}
            medicine={medicine}
          />
        ))}
      </div>

      {canToggleAll ? (
        <div className="loadMoreSection">
          <div className="catalogButtonGroup">
            {hasMore && (
              <button
                type="button"
                className="loadMoreButton"
                onClick={showMoreMedicines}
                aria-label="Tampilkan 8 obat berikutnya"
              >
                <span>
                  Tampilkan 8 obat lagi
                </span>

                <svg
                  className="loadMoreIcon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            <button
              type="button"
              className={`loadMoreButton showAllButton ${
                isShowingAll
                  ? "collapseButton"
                  : ""
              }`}
              onClick={
                isShowingAll
                  ? collapseMedicines
                  : showAllMedicines
              }
              aria-expanded={isShowingAll}
              aria-label={
                isShowingAll
                  ? "Tutup dan tampilkan 8 obat pertama"
                  : "Tampilkan semua data obat"
              }
            >
              <span>
                {isShowingAll
                  ? "Tutup kembali"
                  : "Tampilkan semua"}
              </span>
            </button>
          </div>

          {hasMore ? (
            <p className="remainingProducts">
              Masih tersedia{" "}
              {medicines.length -
                visibleMedicines.length}{" "}
              data obat
            </p>
          ) : (
            <p className="allProductsShown">
              Semua data obat sudah ditampilkan.
            </p>
          )}
        </div>
      ) : medicines.length > 0 ? (
        <p className="allProductsShown">
          Semua data obat sudah ditampilkan.
        </p>
      ) : null}
    </>
  );
}