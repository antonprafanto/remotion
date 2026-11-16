# Bab 06 — Quality Control (QA) & Render Final (`-14 LUFS`)

Video edukasi yang rapi selalu melewati pengecekan sistematis sebelum diunggah.

---

## 1. QA Sebelum Render Penuh

### A. Cek Tipe TypeScript (`npm run lint`)
Pastikan tidak ada error kode atau variabel tak terpakai:
```bash
npm run lint
```

### B. Cek Visual Frame Kunci & Safe Zone (`npm run stills`)
Render hanya beberapa detik krusial (frame 0 hook, transisi tengah, diagram utama, dan penutup) dalam hitungan detik:
```bash
# Cek komposisi KertasA4 pada detik 0, 4, 8, dan 15 dengan overlay Safe Zone (--debug)
npm run stills -- KertasA4 0 4 8 15 --debug --scale=0.5

# Cek sampul/thumbnail ukuran penuh (1080x1920)
npm run stills -- KertasA4Cover 0 --scale=1
npm run stills -- CahayaMatahariCover 0 --scale=1
```
Buka file PNG di `out/stills/` dan pastikan:
1. Tidak ada teks penting menabrak area merah `--debug`.
2. Frame 0 sudah menampilkan klaim utama lengkap dan terbaca jelas.
3. Tidak ada teks yang tumpang tindih dengan `Captions` (di sekitar `y = 1335`) atau `Watermark` (`y = 204`).

### C. Render Pratinjau Cepat Sebagian Frame
Jika hanya ingin mengecek kelancaran gerak di 3 detik pertama (frame 0 sampai 90):
```bash
npm run final -- kertas-a4 --frames=0-90
```
Hasil tersimpan di `out/kertas-a4-preview.mp4`.

---

## 2. Render Final & Standar Audio `-14 LUFS`

Jika semua masih oke, jalankan render penuh:

```bash
npm run final -- kertas-a4 --concurrency=1
```

Apa saja yang dilakukan `scripts/render.mts` + `scripts/lib/finish.mts`?
1. **Antrean kunci render (`scripts/lib/antre.mts`):** mencegah dua render jalan bersamaan di komputer yang sama agar RAM tidak habis.
2. **Pembersih temp otomatis (`scripts/lib/temp.mts`):** menghapus sisa `remotion-webpack-bundle-*` lama di folder Temp OS.
3. **Kualitas maksimum (`CRF 15`, frame `png`, preset `slow`, WebGL `angle`):** karena TikTok, IG, dan YouTube mengompres ulang video saat diunggah, file sumber harus bersih dari artefak kompresi.
4. **Normalisasi audio dua-pass (`loudnorm` → `-14 LUFS`, True Peak `-1.5 dBTP`, AAC `320 kbps` 48 kHz):** stream video disalin apa adanya (`-c:v copy`) tanpa encode ulang, sementara volume narasi + SFX dibuat standar platform media sosial.
5. **Metadata tertanam:** judul, pembuat, tahun hak cipta (`channel` di `theme.ts`), serta seluruh `sources` & `credits` ditanam ke metadata MP4.

Cek metadata MP4 hasil render dengan:
```bash
ffprobe -v error -show_format out/kertas-a4.mp4
```

---

## 3. Audit Setelah Render (`audit.sh`, `beku.py`, `transkrip.py`)

### A. Audit Ringkas & Lembar Kontak 1 fps (butuh Git Bash / bash)
```bash
bash scripts/qa/audit.sh kertas-a4
```
Skrip ini mengecek:
- Resolusi (`1080x1920`), frame rate (`30/1`), durasi.
- **`blackdetect`:** memastikan tidak ada frame hitam tidak disengaja.
- **Lembar kontak 1 fps** (`out/audit-kertas-a4/sheet-*.jpg`): melihat alur visual seluruh video dalam 1 gambar!
- **`words.txt`:** daftar kata per detik.

### B. Deteksi Frame Beku & Frame Dobel (butuh Python)
```bash
python scripts/qa/beku.py out/kertas-a4.mp4
```
Skrip menjalankan filter `tblend=all_mode=difference` di `ffmpeg` untuk melaporkan:
- Rentang diam `>= 0,5` detik (penonton cepat bosan kalau gambar berhenti total).
- Frame dobel terisolasi (tanda klip footage tidak memakai langkah fps bulat atau animasi gambar tidak memakai `SubpixelImg`).

### C. Opsional: Audit Pelafalan Whisper Lokal
```bash
# Setup sekali:
python -m venv out/probe/stt-venv
out/probe/stt-venv/Scripts/pip install faster-whisper

# Cek pelafalan voice.mp3 secara offline:
out/probe/stt-venv/Scripts/python.exe scripts/qa/transkrip.py public/voice/kertas-a4/voice.mp3
```

---

## 4. Membuat Video Baru Sendiri

Untuk membuat video baru (misalnya `efek-doppler`):
1. Duplikat folder `src/videos/kertas-a4/` menjadi `src/videos/efek-doppler/` (atau pakai `cahaya-matahari/` jika ingin 3D).
2. Tulis riset & naskah di `src/videos/efek-doppler/script.ts`.
3. Jalankan `npm run voice -- efek-doppler --estimate`.
4. Daftarkan komposisi di `src/Root.tsx` dan `VIDEOS` di `scripts/render.mts`.
5. Bangun adegan di `scenes/`, cek di `npm run dev` dan `npm run stills`.
6. Setelah naskah final: jalankan `npm run voice -- efek-doppler` (ElevenLabs) lalu `npm run final -- efek-doppler`.

---

Lanjut ke [Bab 07 — Cara Kolaborasi dengan AI Coding Agent](07-workflow-ai-agent.md).
