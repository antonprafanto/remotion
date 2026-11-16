# AGENTS.md

Panduan instruksi proyek ini tersedia di [CLAUDE.md](CLAUDE.md) dan dokumentasi belajar lengkap di [README.md](README.md) serta folder [docs/](docs/).

Aturan singkat sebelum mengedit atau menjalankan skrip:
1. Jangan pernah mencetak, membaca ke log, atau meng-commit `.env` (`ELEVENLABS_API_KEY`).
2. Gunakan `npm run voice -- <slug> --estimate` saat mengembangkan adegan baru; panggil `npm run voice -- <slug>` hanya setelah user menyetujui naskah.
3. Selalu verifikasi perubahan dengan `npm run lint` dan `npm run stills -- <CompositionId> 0 --debug`.
