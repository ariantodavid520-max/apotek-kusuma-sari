"use client";

import {
  useState,
  type FormEvent
} from "react";

import type {
  RecommendationItem
} from "@/types/medicine";

import {
  formatRupiah
} from "@/lib/format";


type FormState = {
  symptoms: string;
  age: string;
  diseaseHistory: string;
};


type ApiResponse = {
  message: string;
  items: RecommendationItem[];
};


const initialState: FormState = {
  symptoms: "",
  age: "",
  diseaseHistory: ""
};


export default function RecommendationForm() {
  const [form, setForm] =
    useState<FormState>(initialState);

  const [data, setData] =
    useState<ApiResponse | null>(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }


  async function submitForm(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setData(null);


    /**
     * Validasi keluhan.
     */
    if (
      form.symptoms.trim().length < 2
    ) {
      setError(
        "Keluhan minimal harus berisi 2 karakter."
      );

      return;
    }


    /**
     * Validasi usia.
     */
    if (!form.age.trim()) {
      setError(
        "Usia wajib diisi."
      );

      return;
    }

    const ageNumber =
      Number(form.age);

    if (
      !Number.isFinite(ageNumber) ||
      ageNumber < 0 ||
      ageNumber > 120
    ) {
      setError(
        "Usia harus berupa angka antara 0 sampai 120 tahun."
      );

      return;
    }


    /**
     * Validasi riwayat penyakit.
     */
    if (
      !form.diseaseHistory.trim()
    ) {
      setError(
        'Riwayat penyakit wajib diisi. Tuliskan "Tidak ada" jika tidak memiliki riwayat penyakit.'
      );

      return;
    }


    setLoading(true);

    try {
      const response = await fetch(
        "/api/recommendations",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            symptoms:
              form.symptoms.trim(),

            age:
              ageNumber,

            diseaseHistory:
              form.diseaseHistory.trim()
          })
        }
      );


      const payload =
        (await response.json()) as
          ApiResponse & {
            error?: string;
          };


      if (!response.ok) {
        setError(
          payload.error ??
            "Rekomendasi gagal diproses."
        );

        return;
      }


      setData(payload);
    } catch (error) {
      console.error(
        "Kesalahan formulir rekomendasi:",
        error
      );

      setError(
        "Server tidak dapat dihubungi. Periksa koneksi dan jalankan kembali aplikasi."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="recommendationLayout">
      <form
        className="recommendationForm"
        onSubmit={submitForm}
      >
        <div className="fieldGrid">
          {/* Kolom keluhan */}
          <label className="formField">
            <span>Keluhan</span>

            <input
              type="text"
              value={form.symptoms}
              onChange={(event) =>
                updateField(
                  "symptoms",
                  event.target.value
                )
              }
              placeholder="Contoh: panas, batuk, flu"
              autoComplete="off"
              required
            />
          </label>


          {/* Kolom usia */}
          <label className="formField">
            <span>Usia</span>

            <input
              type="number"
              min="0"
              max="120"
              step="1"
              value={form.age}
              onChange={(event) =>
                updateField(
                  "age",
                  event.target.value
                )
              }
              placeholder="Contoh: 9"
              inputMode="numeric"
              required
            />
          </label>


          {/* Kolom riwayat penyakit */}
          <label className="formField">
            <span>
              Riwayat Penyakit
            </span>

            <input
              type="text"
              value={
                form.diseaseHistory
              }
              onChange={(event) =>
                updateField(
                  "diseaseHistory",
                  event.target.value
                )
              }
              placeholder='Contoh: asma atau "Tidak ada"'
              autoComplete="off"
              required
            />
          </label>
        </div>


        <button
          type="submit"
          className="primarySubmit"
          disabled={loading}
        >
          {loading
            ? "Memproses..."
            : "Cari Obat"}
        </button>


        <p className="formNote">
          Sistem hanya memberikan
          informasi awal untuk obat
          non-resep. Hentikan penggunaan
          apabila muncul reaksi tidak
          wajar dan konsultasikan dengan
          tenaga kesehatan.
        </p>


        {error ? (
          <p
            className="errorBox"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </form>


      {data ? (
        <section
          className="resultPanel"
          aria-live="polite"
        >
          <div className="sectionHeading compactHeading">
            <p>
              Hasil Rekomendasi
            </p>

            <h2>
              {data.message}
            </h2>
          </div>


          {data.items.length === 0 ? (
            <div className="emptyState">
              <h3>
                Rekomendasi belum
                ditemukan
              </h3>

              <p>
                Tidak ada obat yang
                memenuhi kesesuaian
                keluhan, batas usia,
                dan riwayat penyakit
                yang dimasukkan.
              </p>
            </div>
          ) : (
            <div className="recommendationResults">
              {data.items.map(
                (item, index) => (
                  <article
                    key={`${item.medicine.id}-${index}`}
                    className="recommendationCard"
                  >
                    <div className="rankBadge">
                      #{index + 1}
                    </div>


                    <div className="recommendationInfo">
                      <p className="medicineGroup">
                        {
                          item.medicine
                            .category
                        }
                      </p>


                      <h3>
                        {
                          item.medicine
                            .name
                        }
                      </h3>


                      <p>
                        <strong>
                          Indikasi:
                        </strong>{" "}
                        {
                          item.medicine
                            .indication
                        }
                      </p>


                      <p>
                        <strong>
                          Deskripsi
                          penggunaan:
                        </strong>{" "}
                        {
                          item.medicine
                            .usageDescription
                        }
                      </p>


                      <p>
                        <strong>
                          Ketentuan usia:
                        </strong>{" "}
                        {
                          item.medicine
                            .age ||
                          "Tidak dicantumkan"
                        }
                      </p>


                      <p>
                        <strong>
                          Riwayat penyakit
                          dilarang:
                        </strong>{" "}
                        {item.medicine
                          .forbiddenDiseaseHistory ||
                          "Tidak ada"}
                      </p>


                      <p className="reasonText">
                        {item.reason}
                      </p>


                      <div className="chipRow">
                        <span>
                          {
                            item.medicine
                              .category
                          }
                        </span>

                        <span>
                          {formatRupiah(
                            item.medicine
                              .price
                          )}
                        </span>
                      </div>
                    </div>


                    
                  </article>
                )
              )}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}