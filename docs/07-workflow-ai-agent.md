# Bab 07 — Cara Kolaborasi dengan AI Coding Agent

Proyek seperti `@ohgtternyata` bisa diproduksi cepat dan konsisten bukan karena AI disuruh *"buatkan video bebas"*, melainkan karena ada **pembagian peran yang ketat** dan **aturan kerja (`CLAUDE.md` / `AGENTS.md`)** yang dibaca otomatis oleh AI agent (Claude Code, Antigravity, Cursor, dll.).

---

## 1. Pembagian Peran: Manusia vs AI Agent

| Tahap | Peran Kamu (Sutradara & Editor) | Peran AI Agent |
|---|---|---|
| **1. Topik & Sudut Pandang** | Pilih topik yang relevan dengan audiens & tentukan pesan inti | Mengusulkan ide aktual + mengecek kelayakan data primer |
| **2. Riset & Fakta** | Memutuskan batas klaim & memverifikasi sumber sensitif | Menelusuri sumber primer, mencatat angka & kutipan ke `script.ts` |
| **3. Naskah HTPC** | **Gerbang persetujuan final** sebelum kredit ElevenLabs dipakai | Menulis draf HTPC, menambahkan markup `{tampil\|ucap}` & tag `[casual]` |
| **4. Suara & Pelafalan** | Mendengarkan sampel telinga (`npm run ucapan`) & memilih intonasi | Menjalankan `voice.mts`, menambal segmen/kata (`voice:ganti`, `voice:kata`) |
| **5. Visual & Kode** | Menonton hasil `stills` / `npm run dev`, memberi koreksi rasa | Menulis scene Remotion 2D/3D, sinkronisasi `beat()`, `Sfx`, `EndCard` |
| **6. QA & Finalisasi** | Tonton hasil MP4 akhir sebelum diunggah | Menjalankan `lint`, `stills --debug`, `audit.sh`, `beku.py`, `final` |

---

## 2. Mengapa File `CLAUDE.md` dan `AGENTS.md` Sangat Penting?

Saat AI agent membuka folder repositori ini, ia langsung membaca `CLAUDE.md` / `AGENTS.md`. Tanpa aturan tertulis di sana, AI cenderung mengulang kesalahan umum:
- Memakai kartu kaca neon bercahaya (*AI slop*)
- Memotong grafik batang bukan dari angka nol
- Lupa menaruh sumber di `EndCard`
- Membuang kredit ElevenLabs sebelum naskah disetujui
- Menempatkan teks penting di zona tertutup tombol TikTok/Reels

Kamu bisa menyalin pola `CLAUDE.md` di repo ini dan menyesuaikannya dengan gaya channel kamu sendiri!

---

## 3. Contoh Prompt Bertahap (Siap Pakai)

### Tahap 1 — Riset & Naskah
> *"Kita mau bikin video baru dengan slug `ban-pesawat-nitrogen`. Tolong riset sumber primer (FAA / Boeing / Airbus / literatur teknik) soal kenapa ban pesawat komersial diisi nitrogen bukan udara biasa. Pastikan angkanya akurat, buat draf `script.ts` berstruktur HTPC, pakai markup `{tampil|ucap}`, dan jangan jalankan `npm run voice` dulu sebelum saya setujui."*

### Tahap 2 — Audit Kritis Naskah
> *"Audit ulang draf `script.ts` tadi secara kritis: cek apakah ada klaim yang dilebih-lebihkan dibanding sumbernya, apakah hook frame 0 sudah jelas, dan apakah ada istilah asing yang perlu diuji pelafalannya lewat `npm run ucapan`."*

### Tahap 3 — Prototipe Gratis & Adegan Visual
> *"Naskah oke, tapi jangan pakai ElevenLabs dulu. Jalankan `npm run voice -- ban-pesawat-nitrogen --estimate`, daftarkan di `Root.tsx` dan `render.mts`, lalu bangun adegannya dengan gaya Editorial 2D (`src/kit/Editorial.tsx`). Pastikan tidak ada frame diam >= 0,5 detik dan semua elemen di dalam Safe Zone."*

### Tahap 4 — QA Mandiri
> *"Jalankan `npm run lint` dan `npm run stills -- BanPesawatNitrogen 0 3.5 8 --debug`. Cek langsung gambar PNG hasil `stills` dan perbaiki kalau ada teks terlalu mepet ke zona merah atau terlalu kecil."*

### Tahap 5 — Suara Asli & Render Final
> *"Naskah final disetujui. Jalankan `npm run voice -- ban-pesawat-nitrogen`, cek apakah ada kata salah ucap, lalu render final dengan `npm run final -- ban-pesawat-nitrogen --concurrency=1` dan jalankan `python scripts/qa/beku.py out/ban-pesawat-nitrogen.mp4`."*

---

## 4. Tips Penting Saat Belajar

1. **Mulai dari hal sederhana:** buat dulu video 30–40 detik gaya Editorial 2D tanpa footage eksternal (seperti `kertas-a4`), baru nanti tambahkan footage Pexels/Wikimedia atau scene 3D Three.js.
2. **Jangan pernah commit `.env`:** selalu cek `git status` sebelum `git push`.
3. **Satu render pada satu waktu:** render Remotion + WebGL bisa memakai 3–4 GB RAM (bahkan melonjak sebentar di Chromium). Tutup tab browser berat saat menjalankan `npm run final`.
4. **Saran jujur:** jangan terobsesi visual rumit jika Hook dan sumber faktanya belum kuat. Di video edukasi pendek, **kejelasan topik + hook detik 0 + keakuratan data** menentukan jauh lebih banyak daripada efek visual semata.

---

Lanjut ke [Bab 08 — Bonus: Riset Footage Bebas Komersial & Otomasi Unggah via HP (ADB)](08-footage-komersial-dan-upload-adb.md).
