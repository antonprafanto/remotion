# Bab 03 — Narasi ElevenLabs, Mode `--estimate` & Sinkronisasi Kata `beat()`

Keunggulan utama sistem ini adalah **animasi dan efek suara tidak memakai angka detik hardcode**, melainkan otomatis mengunci diri ke waktu tiap kata diucapkan.

---

## 1. Prototipe Gratis Tanpa API (`--estimate`)

Sebelum menghabiskan kredit ElevenLabs, bangun timeline estimasi terlebih dahulu:

```bash
npm run estimate kertas-a4
# atau di bash/macOS/Linux:
npm run voice -- kertas-a4 --estimate
```

Perintah ini akan membaca `src/videos/kertas-a4/script.ts`, menghitung jumlah suku kata setiap kata di `spoken`, memberi jeda pada tanda baca (`.` `,` `?` `!`), dan menulis file:
- `src/videos/kertas-a4/timeline.generated.json` (dengan `"estimated": true` dan `"audio": null`).

Kamu sudah bisa merancang seluruh animasi di Remotion Studio (`npm run dev`), mengecek kepadatan teks, dan menguji semua `beat('kata')` secara gratis!

---

## 2. Menghubungkan ElevenLabs & Memilih Suara

Jika naskah sudah final dan disetujui:

1. Salin `.env.example` menjadi `.env`, lalu tempel `ELEVENLABS_API_KEY` kamu.
2. Cek kuota karakter dan cari suara berbahasa Indonesia:
   ```bash
   npm run voices -- --json
   ```
   Daftar lengkap tersimpan di `out/voices.json`.
3. **Uji sampel 3 segmen pertama (hemat kredit!):**
   ```bash
   npm run voice -- kertas-a4 --sample Abysa
   ```
   Audio sampel disimpan di `out/sampel-suara/abysa.mp3` disertai laporan kecepatan bicara (kata/detik), jeda terpanjang, dan hasil transkrip QA (jika API key punya izin Speech-to-Text).
4. **Buat narasi penuh:**
   ```bash
   npm run voice -- kertas-a4
   ```
   Skrip ini menghasilkan:
   - `public/voice/kertas-a4/voice.mp3` (audio narasi)
   - `public/voice/kertas-a4/words.json` (timing per kata dari endpoint `with-timestamps`)
   - `src/videos/kertas-a4/timeline.generated.json` (sudah `estimated: false`)

---

## 3. Cara Kerja `beat()` di Dalam Adegan

Di komponen video utama (mis. [KertasA4.tsx](../src/videos/kertas-a4/KertasA4.tsx)), setiap `Sequence` diberi `beat` dan `beatEnd` dari `makeBeat()` (`src/lib/beats.ts`):

```tsx
const b210 = beat('210');       // frame relatif scene saat kata "210" MULAI terucap
const b210End = beatEnd('210'); // frame saat kata "210" SELESAI terucap
```

Lalu di dalam komponen scene:
```tsx
// Garis sorot mulai tergambar 2 frame sebelum kata "210" terdengar, selesai 10 frame kemudian
const s210 = ramp(frame, b210 - 2, b210 + 10);

// Bunyi tick tepat saat kata tersebut muncul
<Sfx name="tick" at={b210} />
```

**Jika suatu kata muncul lebih dari sekali dalam satu scene**, kirim argumen ke-2 (`nth`, dimulai dari `0`):
```tsx
const bPertama = beat('A4', 0);
const bKedua = beat('A4', 1);
```

---

## 4. Trik Hemat Kredit Saat Memperbaiki Pelafalan

Kadang narator AI salah melafalkan satu singkatan atau istilah asing, padahal 95% bagian audio lainnya sudah bagus. Jangan langsung mengulang seluruh naskah! Pakai 4 alat bedah suara ini:

### A. Hanya mengubah tampilan caption (teks ucapan tetap)
Misal ingin mengubah `{210|dua ratus sepuluh}` menjadi `{210 mm|dua ratus sepuluh milimeter}`? Tunggu — kalau ucapan berubah, harus generate ulang. Tapi kalau hanya mengubah `{“A4”|a empat}` menjadi `{A4|a empat}` (hanya menghapus tanda kutip tampilan):
```bash
npm run timeline -- kertas-a4 --tulis
```
Gratis 0 kredit!

### B. Menguji variasi ejaan satu kata (`npm run ucapan`)
```bash
npm run ucapan -- kertas-a4 "Standar internasional {X} dipakai di seluruh dunia." "ai es o" "iso" "i s o"
```
Dengarkan `out/sampel-suara/ucapan-kertas-a4-1.mp3`, `-2.mp3`, `-3.mp3`, lalu pilih yang paling natural di telinga.

### C. Menimpa hanya SATU segmen (`npm run voice:ganti`)
Ubah ejaan di `script.ts` untuk 1 segmen (tetapi jaga token tampilan tetap sama), lalu jalankan:
```bash
npm run voice:ganti -- kertas-a4 lichtenberg
```
Skrip otomatis memakai `previous_text` & `next_text` agar intonasi nyambung, mencari titik sunyi (`< -45 dBFS`), membackup file lama ke `arsip-*`, menyambung PCM audio, dan menggeser seluruh timeline kata sesudahnya!

### D. Menambal SATU kata dari donor (`npm run voice:kata`)
Jika hanya 1 kata dari sampel `npm run ucapan` yang ingin ditempel ke `voice.mp3`:
```bash
npm run voice:kata -- kertas-a4 ISO out/sampel-suara/ucapan-kertas-a4-1.mp3 --donor=1.10,1.65 --target=12.40,12.95
```
Skrip menyamakan level RMS dan melakukan *equal-power crossfade* 15 ms supaya sambungan mulus tanpa bunyi klik.

---

Lanjut ke [Bab 04 — Visual Editorial 2D, Safe Zone, Captions & Aturan Footage](04-visual-2d-dan-footage.md).
