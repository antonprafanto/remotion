# Bab 01 — Setup Komputer, Arsitektur Proyek & Ganti Branding

Di bab ini kamu akan menyiapkan seluruh alat yang dibutuhkan dan memahami cara kerja folder di repositori ini.

---

## 1. Software yang Harus Dipasang

### A. Node.js 22 LTS (Wajib)
Remotion 4 membutuhkan Node.js modern (disarankan v22 LTS):
- Unduh di [nodejs.org](https://nodejs.org/)
- Cek di terminal:
  ```bash
  node -v
  # contoh output: v22.17.0
  ```

### B. ffmpeg Build Lengkap (Wajib)
Remotion memang membawa `ffmpeg` kecil untuk tugas dasar, **tetapi** langkah normalisasi audio (`loudnorm`, `ebur128`), pengecekan frame hitam (`blackdetect`), cek frame beku (`tblend`), dan slow motion (`minterpolate`) membutuhkan **ffmpeg build lengkap**.

- **Windows:**
  ```powershell
  winget install Gyan.FFmpeg
  # atau jika memakai Chocolatey (PowerShell Admin):
  choco install ffmpeg
  ```
  Setelah selesai, **tutup dan buka ulang terminal** supaya `ffmpeg` terbaca di `PATH`.
- **macOS:**
  ```bash
  brew install ffmpeg
  ```
- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update && sudo apt install ffmpeg
  ```

### C. Alat Tambahan (Opsional tapi Sangat Membantu)
1. **Git / Git Bash** (khusus Windows, tersedia di [git-scm.com](https://git-scm.com/)) — untuk menjalankan skrip `scripts/qa/audit.sh` dan upload ke GitHub.
2. **Python 3.10+** — untuk menjalankan `scripts/qa/beku.py` (cek frame beku/dobel) dan `scripts/qa/transkrip.py` (transkrip Whisper lokal).
3. **Akun ElevenLabs** — hanya diperlukan ketika kamu siap membuat narasi suara AI sungguhan (selama latihan tata letak & animasi, kita bisa pakai mode gratis `--estimate`).

---

## 2. Instalasi Proyek & Uji Coba Pertama

Buka terminal di dalam folder repositori:

```bash
npm install
npm run sfx-kit
npm run cek-setup
```

Penjelasan:
- `npm install`: memasang Remotion, React, Three.js, TypeScript, dan `tsx`.
- `npm run sfx-kit`: mensintesis 11 file efek suara `.wav` ke `public/sfx/` dari gelombang suara murni (tidak mengunduh sampel pihak ketiga, jadi **100% bebas klaim hak cipta**).
- `npm run cek-setup`: memverifikasi seluruh prasyarat. Jika ada tanda `✗`, perbaiki dulu petunjuk yang tercetak. Jika `.env` bertanda `⚠`, itu normal saat kamu masih berlatih menggunakan mode `--estimate`.

Jalankan pratinjau visual:
```bash
npm run dev
```
Remotion Studio akan terbuka di browser (default `http://localhost:3000`). Kamu bisa memutar video frame-by-frame, memeriksa timeline audio/animasi, dan mengaktifkan prop `debug: true` pada panel kanan untuk melihat **Safe Zone** TikTok/Reels/Shorts!

---

## 3. Mengganti Identitas Channel (Branding)

Agar video buatanmu tidak membawa nama template `@namachannel`, buka file [src/brand/theme.ts](../src/brand/theme.ts):

```ts
export const channel = {
	name: 'namachannel',
	handle: '@namachannel',
	highlightPrefix: 4,
	copyrightYear: '2026',
};
```

Ubah keempat nilai tersebut sesuai nama channel-mu. Perubahan di satu tempat ini otomatis memperbarui:
1. **Watermark** di pojok kiri atas sepanjang video (`src/components/Watermark.tsx`).
2. **Logo animasi** & ajakan follow di layar penutup (`src/kit/EndCard.tsx`).
3. **Metadata hak cipta** yang tertanam di file `.mp4` (`scripts/render.mts`).

---

## 4. Peta Folder Inti

- **`src/brand/`**: Resolusi (`1080×1920`, `30 fps`), palet warna bermakna, posisi `SafeZones`, dan font lokal (`Plus Jakarta Sans` & `IBM Plex Mono`). Font ditaruh di `public/fonts/` agar proses render tidak tergantung koneksi internet.
- **`src/lib/`**: Otak sinkronisasi naskah ke frame video (`narration.ts`, `timeline.ts`, `beats.ts`, `anim.ts`).
- **`src/components/`**: Lapisan UI global: `Background`, `Captions`, `Watermark`, `Logo`, `SafeZones`, `SceneShell`.
- **`src/kit/`**: Komponen siap pakai: `Editorial.tsx` (tag solid, garis sorot, animasi SVG, penampil foto/video), `EndCard.tsx`, `Sfx.tsx`.
- **`src/three/`**: Mesin 3D WebGL (`Stage`, `PostFX`, `CameraRig`, `camPath`, `Sun3D`, `Planet3D`, `Streaks3D`, `FootagePlane`).
- **`src/videos/<slug>/`**: Folder per video (satu video = satu folder mandiri).
- **`scripts/`**: Alat CLI Node/TypeScript untuk suara, stills, render, dan QA.

---

Lanjut ke [Bab 02 — Riset Sumber Primer & Menulis Naskah HTPC](02-riset-dan-naskah-htpc.md).
