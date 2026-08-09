import { NextResponse } from "next/server";
import { recommendMedicines } from "@/lib/recommendation";
import { getMedicinesFromExcel } from "@/lib/excel-medicines";
import type { RecommendationPayload } from "@/types/medicine";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    /**
     * Menerima data dari RecommendationForm.tsx:
     *
     * symptoms       = keluhan pengguna
     * age            = usia pengguna
     * diseaseHistory = riwayat penyakit pengguna
     */
    const body =
      (await request.json()) as RecommendationPayload;

    const symptoms =
      typeof body.symptoms === "string"
        ? body.symptoms.trim()
        : "";

    const ageValue =
      body.age === undefined ||
      body.age === null
        ? ""
        : String(body.age).trim();

    const diseaseHistory =
      typeof body.diseaseHistory === "string"
        ? body.diseaseHistory.trim()
        : "";

    /**
     * Validasi keluhan.
     */
    if (symptoms.length < 2) {
      return NextResponse.json(
        {
          error:
            "Keluhan minimal harus berisi 2 karakter."
        },
        {
          status: 400
        }
      );
    }

    /**
     * Usia wajib diisi karena digunakan
     * sebagai filter keamanan obat.
     */
    if (!ageValue) {
      return NextResponse.json(
        {
          error: "Usia wajib diisi."
        },
        {
          status: 400
        }
      );
    }

    const age = Number(ageValue);

    if (
      !Number.isFinite(age) ||
      age < 0 ||
      age > 120
    ) {
      return NextResponse.json(
        {
          error:
            "Usia harus berupa angka antara 0 sampai 120 tahun."
        },
        {
          status: 400
        }
      );
    }

    /**
     * Riwayat penyakit wajib diisi.
     *
     * Jika pengguna tidak memiliki riwayat
     * penyakit, pengguna dapat menulis:
     * "Tidak ada".
     */
    if (!diseaseHistory) {
      return NextResponse.json(
        {
          error:
            'Riwayat penyakit wajib diisi. Tuliskan "Tidak ada" jika tidak memiliki riwayat penyakit.'
        },
        {
          status: 400
        }
      );
    }

    /**
     * Membaca seluruh data obat dari Excel.
     */
    const medicines =
      getMedicinesFromExcel();

    if (medicines.length === 0) {
      return NextResponse.json(
        {
          error:
            "Data obat di Excel kosong atau tidak berhasil dibaca."
        },
        {
          status: 500
        }
      );
    }

    /**
     * Mengirim tiga data pengguna ke
     * algoritma rekomendasi.
     */
    const items = recommendMedicines(
      {
        symptoms,
        age,
        diseaseHistory
      },
      medicines,
      10
    );

    return NextResponse.json({
      message:
        items.length > 0
          ? `Ditemukan ${items.length} rekomendasi obat yang sesuai.`
          : "Tidak ditemukan obat yang sesuai dengan keluhan, usia, dan riwayat penyakit Anda.",

      items
    });
  } catch (error) {
    console.error(
      "Kesalahan API rekomendasi:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Terjadi kesalahan saat memproses rekomendasi obat."
      },
      {
        status: 500
      }
    );
  }
}