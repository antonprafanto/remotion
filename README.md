# Tutorial Membuat Video Edukasi 9:16 dengan Kode (Remotion + Three.js + ElevenLabs + ffmpeg)

Starter kit & panduan lengkap untuk membuat video pendek edukasi (TikTok, Instagram Reels, YouTube Shorts) secara **terprogram dan berbasis data** — dari riset sumber primer, penulisan naskah terstruktur, narasi suara AI yang sinkron per kata, motion graphics 2D/3D, hingga quality control & render final `-14 LUFS`.

> Repositori ini adalah versi starter kit bersih yang disiapkan khusus untuk belajar. Di dalamnya sudah ada **2 contoh video utuh** (`kertas-a4` untuk gaya **Editorial 2D/SVG** dan `cahaya-matahari` untuk gaya **3D WebGL Three.js**) yang **100% bisa langsung dijalankan tanpa file footage besar maupun API key berbayar**.

---

## Bagaimana Pipeline Ini Bekerja?

```text
1. Riset & Naskah (src/videos/<slug>/script.ts)
      │  Markup {tampil|ucap} + audio tag [casual] + sumber primer
      ▼
2. Suara & Timeline Per Kata (npm run voice)
      │  Mode gratis `--estimate` ATAU ElevenLabs TTS with-timestamps
      │  Menghasilkan `timeline.generated.json` (waktu mulai & selesai tiap kata)
      ▼
3. Adegan Visual Remotion (Editorial 2D SVG / Footage / 3D Three.js)
      │  Animasi & SFX dipicu kata yang diucapkan lewat `beat('kata')`
      ▼
4. Quality Control (stills, --debug safe zone, cek frame beku, audit 1 fps)
      ▼
5. Render Final (npm run final -- <slug>)
      └─► out/<slug>.mp4 (H.264 CRF 15, audio -14 LUFS, metadata sumber & hak cipta)
```

---

## Quick Start (5 Menit Langsung Jalan)

### Prasyarat
- **Node.js 22 LTS** (minimal v20) — [nodejs.org](https://nodejs.org/)
- **ffmpeg build lengkap** (harus punya filter `loudnorm`, `ebur128`, `minterpolate`, `blackdetect`):
  - Windows: `winget install Gyan.FFmpeg` atau `choco install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Linux (Ubuntu/Debian): `sudo apt install ffmpeg`
- *(Opsional untuk suara AI asli)* Akun & API key **ElevenLabs**
- *(Opsional untuk QA lanjutan)* **Git Bash** & **Python 3**

### Langkah Instalasi & Uji Coba

```bash
# 1. Masuk ke folder proyek & pasang paket npm
npm install

# 2. Buat 11 efek suara bebas hak cipta (public/sfx/*.wav)
npm run sfx-kit

# 3. Cek apakah semua alat di komputer sudah siap
npm run cek-setup

# 4. Buka Remotion Studio untuk melihat pratinjau interaktif kedua contoh video
npm run dev
```

Setelah `npm run dev` berjalan, buka URL yang muncul di browser (biasanya `http://localhost:3000`). Kamu langsung bisa melihat:
- **`KertasA4`** & **`KertasA4Cover`** — contoh video **Editorial 2D + animasi SVG + SFX**.
- **`CahayaMatahari`** & **`CahayaMatahariCover`** — contoh video **3D WebGL (Three.js + GLSL shader + PostFX)**.

---

## Kurikulum Tutorial Lengkap (`docs/`)

Ikuti materi belajar secara berurutan:

| Bab | Materi | Link |
|---|---|---|
| **01** | Setup Komputer, Arsitektur Repo & Ganti Branding Channel | [docs/01-setup-dan-arsitektur.md](docs/01-setup-dan-arsitektur.md) |
| **02** | Riset Sumber Primer & Menulis Naskah HTPC (`script.ts`) | [docs/02-riset-dan-naskah-htpc.md](docs/02-riset-dan-naskah-htpc.md) |
| **03** | Narasi ElevenLabs, Mode `--estimate`, `beat()` & Bedah Ucapan | [docs/03-narasi-elevenlabs-dan-sync.md](docs/03-narasi-elevenlabs-dan-sync.md) |
| **04** | Desain Visual Editorial 2D, Safe Zone, Captions & Aturan Footage | [docs/04-visual-2d-dan-footage.md](docs/04-visual-2d-dan-footage.md) |
| **05** | Visual 3D WebGL (Three.js, PostFX, Shader, `camPath`, `FootagePlane`) | [docs/05-visual-3d-threejs.md](docs/05-visual-3d-threejs.md) |
| **06** | Quality Control (Stills, Audit, Cek Frame Beku) & Render `-14 LUFS` | [docs/06-qa-dan-render-final.md](docs/06-qa-dan-render-final.md) |
| **07** | Cara Kolaborasi dengan AI Coding Agent (Claude Code / Antigravity / Cursor) | [docs/07-workflow-ai-agent.md](docs/07-workflow-ai-agent.md) |
| **08** | Bonus: Riset Footage Bebas Komersial & Otomasi Upload HP via ADB | [docs/08-footage-komersial-dan-upload-adb.md](docs/08-footage-komersial-dan-upload-adb.md) |

---

## Struktur Folder Proyek

```text
.
├── .env.example                 # Template ELEVENLABS_API_KEY (jangan commit .env asli!)
├── AGENTS.md / CLAUDE.md        # Aturan kerja untuk AI coding agent
├── docs/                        # 7 modul tutorial langkah demi langkah
├── public/
│   ├── fonts/                   # Font lokal (Plus Jakarta Sans & IBM Plex Mono, SIL OFL)
│   └── sfx/                     # Efek suara hasil `npm run sfx-kit` (bebas hak cipta)
├── scripts/
│   ├── lib/                     # Helper antrean render, ElevenLabs, ffmpeg, normalisasi audio
│   ├── qa/                      # Audit video: audit.sh, beku.py, transkrip.py
│   ├── cek-setup.mts            # Pengecek kesiapan lingkungan komputer
│   ├── demo-footage.mts         # Buat klip video demo sintetis via ffmpeg
│   ├── hp.mjs                   # Opsional: kendali HP Android via ADB untuk unggah sosmed
│   ├── render.mts               # Render MP4 final + metadata hak cipta + -14 LUFS
│   ├── sfx-kit.mts              # Sintesis 11 file .wav SFX dari nol
│   ├── stills.mts               # Render frame PNG untuk QA visual
│   └── voice*.mts               # Generate suara, estimasi timeline, tes ucapan, tambal kata
└── src/
    ├── brand/                   # Identitas channel (theme.ts) & font lokal (fonts.ts)
    ├── components/              # Captions, Watermark, Logo, SafeZones, Background, SceneShell
    ├── kit/                     # Editorial.tsx (UI 2D siap pakai), EndCard.tsx, Sfx.tsx
    ├── lib/                     # Engine narasi ({tampil|ucap}), timeline, beat(), animasi
    ├── three/                   # Engine 3D: Stage, PostFX, CameraRig, Sun3D, Planet3D, Streaks3D, dll.
    └── videos/
        ├── kertas-a4/           # Contoh #1: Editorial 2D + SVG prosedural
        └── cahaya-matahari/     # Contoh #2: 3D WebGL Three.js prosedural
```

---

## Daftar Perintah Penting

| Perintah | Kegunaan |
|---|---|
| `npm run cek-setup` | Cek Node, npm, ffmpeg, aset lokal, disk, dan status `.env` |
| `npm run sfx-kit` | Buat ulang file efek suara di `public/sfx/` |
| `npm run dev` | Buka Remotion Studio (preview interaktif di browser) |
| `npm run lint` | Cek error TypeScript (`tsc --noEmit`) |
| `npm run estimate <slug>` | Bangun `timeline.generated.json` estimasi **tanpa memanggil API** (praktis di PowerShell) |
| `npm run voice -- <slug> --estimate` | Alternatif perintah estimasi via `voice.mts` |
| `npm run voices -- --json` | Cek kuota ElevenLabs & daftar suara bahasa Indonesia |
| `npm run voice -- <slug> --sample Nama` | Uji 3 segmen pertama dengan suara tertentu (hemat kredit) |
| `npm run voice -- <slug>` | Buat narasi MP3 penuh + timing per kata |
| `npm run timeline -- <slug> --tulis` | Perbarui teks caption di timeline tanpa panggil API ulang |
| `npm run ucapan -- <slug> "kalimat {X}" "v1" "v2"` | Uji ejaan kata/singkatan sebelum membuat narasi penuh |
| `npm run voice:ganti -- <slug> <segId>` | Regenerasi 1 segmen saja lalu sambung ke audio yang ada |
| `npm run voice:kata -- <slug> <kata> <donor.mp3> --donor=a,b --target=c,d` | Tambal 1 kata di tengah audio dengan crossfade |
| `npm run stills -- <CompositionId> 0 3.5 --debug` | Render gambar PNG pada detik tertentu + overlay Safe Zone |
| `npm run final -- <slug>` | Render MP4 final CRF 15 + normalisasi audio `-14 LUFS` |
| `npm run final -- <slug> --frames=0-90` | Render pratinjau sebagian frame saja |
| `npm run demo-footage` | Buat contoh klip MP4 30fps di `public/footage/demo/` untuk latihan |
| `npm run bersih-temp` | Bersihkan folder bundle sementara Remotion di OS Temp |

---

## Cara Upload Proyek Ini ke GitHub Kamu

1. **Pastikan `.env` tidak ikut ter-upload** (`.gitignore` sudah mengabaikan `.env`, `node_modules/`, `out/`, dan `data-raw/`).
2. Buat repository baru yang masih kosong di [github.com/new](https://github.com/new).
3. Jalankan perintah berikut di terminal folder proyek:

```bash
git status            # pastikan tidak ada .env atau file besar di out/
git branch -M main
git remote add origin https://github.com/<username-kamu>/<nama-repo>.git
git push -u origin main
```

Selamat belajar dan berkarya!
