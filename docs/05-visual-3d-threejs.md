# Bab 05 — Visual 3D WebGL (Three.js, PostFX, Shader & `FootagePlane`)

Contoh `cahaya-matahari` memperlihatkan bagaimana Remotion bisa menggabungkan scene 3D sinematik (Three.js + GLSL shader + efek lensa) yang tersinkronisasi per frame dengan ucapan narator.

---

## 1. Mengapa Ada `Stage`, `PostFX`, dan `ANGLE`?

Di Remotion biasa, komponen Three.js standar sering mengalami 3 masalah klasik saat dirender headless:
1. **Frame ke-0 kosong (hitam):** `<EffectComposer>` bawaan `@react-three/postprocessing` menyiapkan buffer di dalam `useEffect`, terlambat saat frame 0 ditangkap Remotion.
   - **Solusi di `src/three/PostFX.tsx`:** `EffectComposer` dibuat **sinkron** lewat `useMemo`, lalu dipanggil di `useFrame(..., 1)`.
2. **Layar tiba-tiba hitam di GPU Intel/D3D11:** fungsi GLSL `pow(x, e)` untuk angka negatif kecil menghasilkan `NaN`, lalu *Bloom* menyebarkan satu piksel `NaN` menjadi hitam se-layar.
   - **Solusi di `src/three/glsl.ts` & `PostFX.tsx`:** pakai `spow()` (`pow(max(x, 1e-6), e)`) dan `SanitizeEffect` sebelum bloom untuk membersihkan `NaN`/`Inf`.
3. **WebGL gagal di Chromium headless:** tanpa renderer GPU ANGLE, Three.js tidak bisa merender shader kompleks.
   - **Solusi di `remotion.config.ts` & skrip CLI:** `Config.setChromiumOpenGlRenderer('angle')` dan `chromiumOptions: {gl: 'angle'}`.

---

## 2. Koreografi Kamera dengan `CameraRig` & `camPath`

Di Remotion, **animasi harus murni bergantung pada `useCurrentFrame()`** (tidak boleh memakai `useFrame((_, delta) => mesh.rotation.y += delta)` karena Remotion merender frame secara paralel dan acak!).

### A. Kamera Sederhana (`CameraRig`)
```tsx
const camPos: Vec3 = [mix(u, 0.8, -0.6), mix(u, -1.8, -1.3), mix(u, 11.2, 9.8)];
<CameraRig position={camPos} lookAt={[0, 0.45, 0]} fov={38} />
```

### B. Kamera Mengorbit Halus (`camPath`)
`camPath()` menginterpolasi posisi kamera dalam **koordinat bola (*spherical*)** di sekitar titik pandang `look`, sehingga kamera tidak "memotong jalan" menembus tengah objek 3D saat mengorbit:

```tsx
const keys: CamKey[] = [
	{f: 0, pos: [6.5, 1.5, 13.5], look: [0, 0.3, 0], fov: 36},
	{f: Math.round(dur * 0.45), pos: [1.5, -0.4, 14.5], look: [0, 0.1, 0], fov: 35},
	{f: dur, pos: [-5.5, -1.6, 12.8], look: [0, -0.6, 0], fov: 34},
];
const cam = camPath(frame, keys, 35);
```

### C. Menempelkan Label HTML ke Objek 3D (`projector()`)
Agar label teks tajam (tidak pecah di 3D canvas), proyeksikan koordinat dunia 3D menjadi koordinat piksel layar `(x, y)` 1080×1920:

```tsx
const project = projector(cam);
const earthPt = project([0, -4.7, 0]);
```
Lalu taruh `<div>` HTML biasa pada posisi `left: earthPt.x, top: earthPt.y`! Lihat contohnya di [Perjalanan3D.tsx](../src/videos/cahaya-matahari/scenes3d/Perjalanan3D.tsx).

---

## 3. Shader & Partikel Deterministik

Semua komponen di `src/three/` menghitung kondisi dari `frame` / `time` secara deterministik:
- **`Sun3D.tsx`:** permukaan Matahari dari 3D *domain-warped FBM simplex noise* + korona aditif.
- **`Planet3D.tsx`:** planet mirip Bumi 100% prosedural (benua, laut + kilau matahari, awan berputar, es kutub, lampu kota malam, dan halo atmosfer) tanpa memuat file tekstur JPG!
- **`Earth3D.tsx`:** alternatif jika kamu ingin memasang tekstur nyata NASA Blue Marble / Black Marble di `public/assets/earth/`.
- **`Streaks3D.tsx` & `Trail.tsx`:** ribuan berkas partikel (foton, hujan, neutrino) dalam **1 draw call** GPU dengan dukungan `stop` sphere (berkas cahaya berhenti menabrak permukaan planet!).

---

## 4. Menyatukan Rekaman Video Nyata ke Ruang 3D (`FootagePlane`)

Komponen `FootagePlane` (`src/three/Footage.tsx`) mengambil frame video MP4 dari server offthread Remotion dan memetakkannya sebagai bidang di ruang 3D:
- **Kenapa dipakai?** Supaya klip video Pexels mendapat efek lensa yang serasi (*bloom*, *film grain*, *vignette*, *AgX tone mapping*) dan bisa ditaruh di belakang partikel 3D!
- **Frame Blending:** jika kamu membuat *speed ramp* atau slow motion ekstrem tanpa `minterpolate`, beri prop `fps={fpsKlip}` pada `<FootagePlane>` sehingga posisi di antara dua frame dicampur halus (*frame blending*).
- Di `src/kit/Editorial.tsx`, komponen `<Shot>` dan `<Rekaman>` membungkus `Stage` + `FootagePlane` + `PostFX` sehingga mudah dipakai di video 2D biasa sekalipun.

---

Lanjut ke [Bab 06 — Quality Control (QA) & Render Final `-14 LUFS`](06-qa-dan-render-final.md).
