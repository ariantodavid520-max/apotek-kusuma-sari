-- Tambahkan kolom baru sebagai nullable terlebih dahulu
-- agar 250 data lama tidak menyebabkan migrasi gagal.
ALTER TABLE `medicines`
    ADD COLUMN `age` VARCHAR(100) NULL,
    ADD COLUMN `forbiddenDiseaseHistory` TEXT NULL;


-- Isi nilai sementara untuk seluruh data lama.
-- Nilai ini nantinya akan diganti dari file Excel.
UPDATE `medicines`
SET `age` = 'Tidak diketahui'
WHERE `age` IS NULL
   OR TRIM(`age`) = '';


UPDATE `medicines`
SET `forbiddenDiseaseHistory` = 'Tidak ada'
WHERE `forbiddenDiseaseHistory` IS NULL
   OR TRIM(`forbiddenDiseaseHistory`) = '';


-- Setelah seluruh baris memiliki nilai,
-- ubah kolom menjadi wajib atau NOT NULL.
ALTER TABLE `medicines`
    MODIFY COLUMN `age` VARCHAR(100) NOT NULL,
    MODIFY COLUMN `forbiddenDiseaseHistory` TEXT NOT NULL;


-- Hapus atribut lama yang sudah tidak digunakan.
ALTER TABLE `medicines`
    DROP COLUMN `symptoms`;