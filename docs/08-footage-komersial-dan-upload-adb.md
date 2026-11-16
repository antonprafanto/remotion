# Bab 08 — Bonus: Riset Footage Bebas Komersial & Otomasi Unggah via HP (ADB)

Di workflow aslinya, AI agent tidak hanya menulis kode Remotion — tetapi juga membantu **mencari footage & gambar bebas hak cipta komersial**, menyiapkan caption, sampai **mengunggah & menjadwalkan ke 4 platform** (TikTok, Instagram, Facebook, YouTube) lewat HP Android yang tersambung ke laptop.

---

## 1. Mencari Footage & Gambar *Free Commercial Use*

Setiap aset visual pihak ketiga wajib aman dipakai ulang secara komersial dan dicek bingkainya sebelum dipakai:

### A. Sumber yang Paling Aman
1. **Pexels** — gratis untuk penggunaan komersial, kredit opsional (tetap disarankan dicatat di `credits`).
   - *Rambu penting lisensi Pexels:* wajah orang yang bisa dikenali tidak boleh ditampilkan dalam konteks buruk (*bad light*), mis. kriminal, penyakit, atau kemiskinan. Pakai shot tanpa wajah atau ilustrasi SVG.
2. **Wikimedia Commons** — pilih lisensi **CC0 / Public Domain** atau **CC BY 2.0 / 3.0 / 4.0**.
   - Jika memakai **CC BY**, **wajib mencantumkan nama pencipta + lisensi** di `EndCard` dan deskripsi saat unggah!
   - Cek hak potret (*personality rights*) jika ada wajah orang yang jelas.
3. **Instansi Resmi / Domain Publik Pemerintah** — misalnya foto/dokumen NASA (domain publik AS), CDC PHIL, atau teks undang-undang / putusan pengadilan resmi.

### B. Checklist Sebelum Memakai Klip Video
- Periksa **fps isi sebenarnya** (bukan hanya header container) dengan `ffprobe` atau periksa frame-by-frame.
- Pastikan **tidak ada logo merek / pelat nomor / wajah / watermark lain** yang masuk ke dalam frame (potong/crop atau buramkan terlebih dahulu lewat `ffmpeg` / Python).
- Catat URL sumber, ID klip, nama pembuat, dan lisensi di `export const credits = [...]` pada `script.ts`.

---

## 2. Mengunggah & Menjadwalkan ke HP Lewat ADB (`scripts/hp.mjs`)

Mengapa lewat HP (ADB) bukan browser laptop?
- Fitur penjadwalan musik/audio, thumbnail cover khusus, stiker/label AI (*AI-generated content*), dan *upload pipeline* TikTok/Instagram Reels/FB Reels sering lebih lengkap dan stabil di aplikasi HP.
- Laptop tetap jadi pusat kendali: kamu tidak perlu memindahkan file MP4 atau mengetik caption panjang secara manual di layar HP.

### A. Persiapan Sekali Saja
1. Pasang **Android Platform Tools (`adb`)**:
   - Windows: `winget install Google.PlatformTools`
   - macOS: `brew install android-platform-tools`
   - Linux: `sudo apt install android-tools-adb`
2. Di HP Android: aktifkan **Opsi Pengembang (*Developer Options*) → USB Debugging**.
3. Colok kabel USB ke laptop, lalu cek di terminal:
   ```bash
   adb devices
   ```
   Klik **"Selalu izinkan / Allow USB debugging"** di layar HP hingga statusnya `device`.

### B. Perintah Dasar `scripts/hp.mjs`

| Perintah | Fungsi |
|---|---|
| `node scripts/hp.mjs push out/kertas-a4.mp4 sdcard/Movies/kertas-a4.mp4` | Kirim file video/sampul ke galeri HP |
| `node scripts/hp.mjs ui` | Tampilkan semua tombol/teks UI beserta koordinat `[cx, cy]` layar saat ini |
| `node scripts/hp.mjs tapt "Berikutnya"` | Ketuk otomatis elemen UI yang cocok dengan teks/regex |
| `node scripts/hp.mjs tap 540 1200` | Ketuk koordinat piksel `(x, y)` |
| `node scripts/hp.mjs typef caption.txt` | Ketik isi file teks ASCII ke kolom caption aktif di HP |
| `node scripts/hp.mjs shot cek` | Ambil tangkapan layar ke folder sementara OS (`%TEMP%/ooohgt-hp/cek.png`) |
| `node scripts/hp.mjs app com.zhiliaoapp.musically` | Buka aplikasi berdasarkan package name |

### C. Batasan Penting `adb input text`
Perintah `type` / `typef` di Android ADB **hanya menerima karakter ASCII** (huruf a–z, angka, tanda baca standar, dan baris baru).
- Artinya: sebelum dikirim via `typef`, pastikan file caption **tidak berisi emoji, tanda panah Unicode (`→`), tanda `×`, atau em-dash (`—`)** — ganti dengan versi ASCII seperti `->`, `x`, `-`.

### D. Tips Privasi Saat Memakai ADB dengan AI Agent
- File `scripts/hp.mjs` sengaja menyimpan screenshot ke folder sementara OS (`%TEMP%/ooohgt-hp`), **bukan di dalam folder proyek Git**, supaya notifikasi pribadi atau layar akunmu tidak pernah sengaja ter-commit ke GitHub.
- Selalu minta AI agent mengonfirmasi sebelum menekan tombol final **Terbitkan / Jadwalkan** jika kamu ingin meninjau pratinjau terakhir di HP.
