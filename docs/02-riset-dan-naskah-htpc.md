# Bab 02 — Riset Sumber Primer & Menulis Naskah HTPC (`script.ts`)

Video edukasi yang dipercaya dan sering disimpan penonton tidak dimulai dari kode, melainkan dari **ketepatan data** dan **struktur cerita yang padat**.

---

## 1. Prinsip Riset Sumber Primer

Jangan pernah menulis skrip hanya dari ringkasan berita atau ingatan. Urutan prioritas sumber:
1. **Dokumen & Data Primer** — regulasi resmi (UU/Permen/OJK/BMKG/Kemenkes), standar baku (ISO, BIPM, IAU), atau dataset resmi (BPS, NOAA, NASA).
2. **Riset *Peer-Reviewed*** — jurnal ilmiah atau meta-analisis.
3. **Media / Artikel Populer** — hanya dipakai sebagai *penunjuk jalan* untuk menemukan dokumen aslinya, bukan sumber utama yang dikutip.

### Aturan Penulisan Klaim
- **Jangan melebihkan klaim:** jika sumber menulis "diperkirakan" atau "kemungkinan", ucapkan begitu.
- **Angka tahun & satuan wajib jelas:** selalu sertakan tahun atau versi aturan jika relevan (misal `ISO 216:2007`, `IAU 2012`).
- **Tulis jejak sumber langsung di `script.ts`:** di setiap segmen taruh komentar sumbernya, lalu rangkum di `export const sources = [...]`.

---

## 2. Struktur Naskah **HTPC**

Setiap video memakai pola 4 bagian yang rapat tanpa basa-basi:

### H — Hook (0–3 detik pertama)
- **Aturan 3 lapis serempak:** suara mulai ≤ 0,3 detik, visual konkret sudah bergerak di frame 0, dan judul klaim utuh sudah terlihat di layar pada frame 0.
- Hindari pembuka klise seperti *"Halo guys, tahukah kalian..."*. Langsung lempar inti masalah atau fakta mengejutkan yang jujur.
- Contoh di `src/videos/kertas-a4/script.ts`:
  > *"Kenapa kertas A4 ukurannya nggak bulat — malah 210 kali 297 milimeter?"*

### T — Tension (Menunjukkan Taruhan / Masalah)
- Satu ketukan singkat untuk membuka *"kenapa ini penting"* atau *"apa akibatnya kalau berbeda"*.
- Contoh:
  > *"Kalau dibulatkan jadi 200 kali 300, begitu dilipat dua, perbandingan panjang dan lebarnya langsung rusak."*

### P — Payoff (Penjelasan Mekanisme + Bukti)
- Jawab rasa penasaran dengan mekanisme nyata, sejarah penemuan, atau angka terukur — bukan sekadar mengulang judul.
- Pecah menjadi beberapa `Segment` pendek (1–2 kalimat per segmen) agar mudah berganti adegan visual.

### C — Call to Value / Outro
- Berikan nilai tambah singkat atau kesimpulan yang mudah diceritakan ulang (*"oh gitu"*) + penutup ringkas:
  > *"Oh... gitu ternyata."*
- Pasangkan dengan `export const tail = 0.5;` agar video selesai 0,5 detik sesudah kata penutup (menjaga *completion rate* tetap tinggi).

---

## 3. Anatomi File `script.ts` & Markup Narasi

Lihat contoh lengkap di [src/videos/kertas-a4/script.ts](../src/videos/kertas-a4/script.ts). Di dalam `segments`, ada dua sintaks khusus yang diproses oleh `src/lib/narration.ts`:

### A. Markup `{tampil|ucap}`
Memisahkan **apa yang tertulis di caption layar** dari **apa yang dibacakan narator AI**:

```ts
// Caption menampilkan "210", narator membaca "dua ratus sepuluh"
say: 'Kenapa kertas {A4|a empat} ukurannya {210|dua ratus sepuluh} kali {297|dua ratus sembilan puluh tujuh}?'
```

**Kapan wajib memakai `{tampil|ucap}`?**
- Angka dan desimal: `{149,6|seratus empat puluh sembilan koma enam}` (koma pada TTS Indonesia kadang dibaca kacau jika ditulis angka).
- Tahun: `{1786,|seribu tujuh ratus delapan puluh enam,}` (tanda baca koma ikut masuk di keduanya agar jeda tetap pas).
- Singkatan yang dieja atau istilah asing: `{ISO|ai es o}`, `{A4|a empat}`, `{HP|hape}`.

> **Penting:** jika suatu kata/singkatan diucapkan sebagai satu kata di TTS tetapi kamu tulis jadi beberapa kata di bagian `ucap` (misalnya `{210|dua ratus sepuluh}`), engine `narration.ts` menganggap `210` sebagai **1 Token tampilan** yang memetakan rentang waktu dari kata `"dua"` sampai `"sepuluh"`. Jadi `beat('210')` tetap berfungsi persis!

### B. Audio Tag ElevenLabs `[tag]`
Kamu bisa menaruh tag ekspresi ElevenLabs v4 di dalam kurung siku, misalnya:
- `[casual]` — nada santai bercerita di awal hook
- `[inhales]` — tarikan napas alami sebelum masuk ke penjelasan inti

Engine `narration.ts` **otomatis membuang `[tag]` dari caption dan forced alignment**, sehingga `[casual]` hanya dikirim ke ElevenLabs TTS dan tidak pernah bocor muncul sebagai teks di layar.

---

Lanjut ke [Bab 03 — Narasi ElevenLabs, `--estimate`, & Sinkronisasi Kata `beat()`](03-narasi-elevenlabs-dan-sync.md).
