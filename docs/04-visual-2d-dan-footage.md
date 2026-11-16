# Bab 04 — Visual Editorial 2D, Safe Zone, Captions & Aturan Footage

Gaya visual di sini terinspirasi media sains/jurnalistik modern: **bersih, informatif, kontras tinggi, tanpa hiasan murahan ("AI slop")**.

---

## 1. Gaya Editorial vs "AI Slop"

| Hindari ("AI Slop") | Gunakan (Gaya Editorial Kit) |
|---|---|
| Pil/tombol kaca neon bercahaya (`glow`, `backdrop-blur` berlebihan) | `SolidTag`: kotak tegas bersudut tipis (`borderRadius: 5`) dengan kontras tinggi |
| Angka melayang tanpa satuan, tahun, atau sumber | Setiap angka wajib bawa satuan + tahun + sumber (`ISO 216`, `IAU 2012`) |
| Grafik batang terpotong agar terlihat dramatis | **Grafik jujur:** batang selalu mulai dari 0, skala seragam |
| Tampilan HP/dokumen rekaan tanpa keterangan | Beri label `ILUSTRASI` atau `SKEMA` (ukuran minimal `26 px`) |
| Layar diam membeku saat jeda bicara | `DriftGrid` + `breathe()` + dorongan kamera sub-piksel (`SubpixelImg`) |

---

## 2. Tata Letak Aman Portrait 9:16 (`1080 × 1920`)

Di TikTok, Reels, dan Shorts, pinggir layar tertutup tombol UI aplikasi. Batas aman yang didefinisikan di `src/brand/theme.ts`:
- **Atas (`y < 170`):** tertutup bar atas → `Watermark` ditaruh di `y = 204`, judul dimulai sekitar `y = 262`.
- **Kanan (`x > 960`):** tertutup tombol like, komentar, share → jaga teks & diagram di kiri `x = 950` (`right: 130` sudah aman).
- **Bawah (`y > 1520`):** tertutup nama akun, deskripsi, audio → `Captions` berada di `y = 1335`, label sumber foto/ilustrasi di `y = 1452`.

Aktifkan overlay merah saat QA dengan:
```bash
npm run stills -- KertasA4 0 5.0 --debug
```

---

## 3. Mengapa Animasi Halus Penting (`SubpixelImg` & Aturan Gerak)

### A. Masalah Dorongan Lambat pada Gambar (`Foto` / `SubpixelImg`)
Jika kamu menggerakkan foto pelan memakai CSS `left` dan `top`, browser sering membulatkan posisi ke piksel utuh sehingga muncul frame ganda/tersendat.
Di `src/kit/Editorial.tsx`, komponen `Foto` memakai `SubpixelImg` dengan CSS GPU:
```tsx
transform: `translate3d(${x}px, ${y}px, 0) scale(${s})`
```
Gerakan 0,2 piksel per frame pun dirender mulus!

### B. Aturan Kecepatan Footage Video (`kecepatan × fps_klip / 30 = bilangan bulat`)
Jika kamu memakai klip rekaman nyata (mis. dari Pexels atau Wikimedia Commons) di dalam video 30 fps:
- Klip **30 fps** → putar `1×` (1 frame sumber = 1 frame output)
- Klip **60 fps** → putar `0,5×` atau `1×`
- Klip **24 fps** → putar `1,25×` (atau interpolasi dulu dengan `ffmpeg`!)
- Klip **25 fps** → putar `1,2×`

Jika kamu memutar klip 24 fps pada kecepatan `1×` di komposisi 30 fps, tiap 4 frame akan ada 1 frame ganda (gerakan patah-patah!).

**Cara menyiapkan klip footage dengan `ffmpeg`:**
```bash
# 1. Crop ke 9:16 (1080x1920) dan ubah ke 30 fps konstan atau slow-motion mulus via minterpolate
ffmpeg -i sumber.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920,minterpolate=fps=60:mi_mode=mci" -an out-60fps.mp4

# 2. Jika rekaman HP aslinya VFR / berisi frame duplikat (mis. klip kilat 10fps di wadah 60fps):
ffmpeg -i sumber.mp4 -vf "mpdecimate,framerate=fps=75,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -an out-75fps.mp4
```

Ingin latihan memakai komponen `<Rekaman>` tanpa mengunduh video eksternal dulu? Jalankan:
```bash
npm run demo-footage
```
Skrip ini membuat `public/footage/demo/latar-demo.mp4` (1080×1920, 30 fps, 180 frame) siap pakai!

---

## 4. Sistem `Captions.tsx` dan `EndCard.tsx`

- **`Captions.tsx`** memecah kalimat menjadi halaman berisi maksimal **3 kata** dan **≤ 18 huruf** (toleransi 20) memakai *dynamic programming*. Kata depan seperti `"di"`, `"ke"`, `"yang"`, `"dan"` diberi penalti tinggi jika menggantung di akhir baris, sehingga tidak ada kata yatim yang memutus arti bacaan.
- **`EndCard.tsx`** dipasang di atas visual adegan terakhir yang tetap bergerak (bukan layar hitam), langsung menampilkan:
  - Logotype channel menyala mengikuti ketukan kata penutup
  - Handle (`follow @namachannel`)
  - Daftar **Sumber** + **Kredit aset** (ukuran ≥ 26 px)

---

Lanjut ke [Bab 05 — Visual 3D WebGL (Three.js, PostFX, Shader & `FootagePlane`)](05-visual-3d-threejs.md).
