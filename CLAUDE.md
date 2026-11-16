# Panduan Kerja untuk AI Agent (`CLAUDE.md`)

Proyek ini adalah pipeline pembuatan video edukasi pendek 9:16 (1080×1920, 30 fps) berbasis **Remotion + Three.js + ElevenLabs + ffmpeg**.

## Bahasa & Gaya Komunikasi
- Berkomunikasi dengan user dalam bahasa Indonesia yang santai, jelas, dan jujur (jangan mengarang angka atau hasil tes yang belum dijalankan).

## Alur Pembuatan Satu Video
1. **Riset & Verifikasi Sumber:**
   - Cari sumber primer terlebih dahulu (data resmi pemerintah/lembaga terkait, standar ISO/BIPM, atau jurnal ilmiah *peer-reviewed*).
   - Jangan melebih-lebihkan klaim: kalau sumber menyebut "kemungkinan" atau "diperkirakan", tulis begitu di naskah.
   - Catat semua sumber lengkap di `export const sources` pada `src/videos/<slug>/script.ts` dan komentar di tiap segmen.
2. **Naskah (`src/videos/<slug>/script.ts`) berstruktur HTPC:**
   - **Hook (0–3 detik):** klaim utuh/inti pertanyaan langsung tampil di frame 0 dan mulai terucap ≤ 0,3 detik.
   - **Tension:** ketukan singkat yang menunjukkan taruhan/masalahnya.
   - **Payoff:** penjelasan mekanisme berbasis fakta dan diagram/visual nyata.
   - **Call to Value / Outro:** ajakan ringan + penutup ringkas (`export const tail = 0.5`).
   - Pakai markup `{tampil|ucap}` untuk angka, singkatan, atau istilah asing agar caption rapi dan pelafalan TTS tepat.
   - **Gerbang persetujuan:** selalu minta persetujuan user pada naskah final sebelum menjalankan `npm run voice -- <slug>` (agar kredit ElevenLabs tidak terbuang).
3. **Timing & Prototipe Gratis:**
   - Jalankan `npm run voice -- <slug> --estimate` lebih dulu untuk membangun `timeline.generated.json` tanpa memanggil API.
   - Bangun semua adegan memakai `beat('kata')` / `beatEnd('kata')` dan `segStart('id')` agar adegan otomatis menyesuaikan durasi suara asli nantinya.
4. **Aturan Visual & Anti-"AI Slop":**
   - Gunakan bahasa editorial yang rapi: tag solid (`SolidTag`), bukan pil neon/kaca bercahaya.
   - Pastikan **klaim utuh sudah terbaca di frame 0**.
   - **Jangan pernah membiarkan frame diam ≥ 0,5 detik:** gunakan `DriftGrid`, dorongan kamera sub-piksel (`SubpixelImg` / `transform`), atau gerak halus (`breathe`).
   - **Aturan grafik jujur:** grafik batang wajib mulai dari 0, skala konsisten, satuan & tahun data tertulis jelas di layar.
   - **Safe Zone:** jangan taruh teks/info penting di atas `y=170`, di bawah `y=1520`, atau di kanan `x>960`.
   - **Aturan footage (jika memakai klip video):** kecepatan putar wajib menghasilkan langkah frame bulat (`kecepatan × fps_klip / 30 = bilangan bulat`), atau gunakan frame blending `fps` pada `FootagePlane`.
   - **Penutup (`EndCard`):** wajib menempel di atas visual terakhir yang tetap bergerak (bukan layar hitam polos) dan wajib menampilkan `sources` + `credit`.
5. **QA Sebelum & Sesudah Render:**
   - Cek TypeScript: `npm run lint`.
   - Cek frame kunci + Safe Zone: `npm run stills -- <CompositionId> 0 3.5 --debug` lalu baca PNG hasilnya.
   - Render final: `npm run final -- <slug> --concurrency=1` (menghasilkan `out/<slug>.mp4` dengan normalisasi `-14 LUFS`).
   - Audit render: `bash scripts/qa/audit.sh <slug>` dan `python scripts/qa/beku.py out/<slug>.mp4`.

## Keamanan
- `.env` berisi `ELEVENLABS_API_KEY`: **jangan pernah membaca isinya ke output chat, mencetaknya, atau memasukkannya ke Git**.
