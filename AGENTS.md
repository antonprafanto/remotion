# AGENTS.md

Ikuti seluruh alur kerja dan aturan autopilot di [CLAUDE.md](CLAUDE.md), serta detail teknis di [docs/referensi-teknis.md](docs/referensi-teknis.md).

Ringkasan prinsip untuk semua AI Agent:
1. User cukup memberi prompt sederhana — kerjakan setup (`npm install`, `npm run setup`, pasang `ffmpeg` bila perlu), riset, kode, QA, hingga render secara mandiri.
2. Gunakan `npm run estimate <slug>` saat mengembangkan animasi; minta persetujuan naskah dari user sebelum menjalankan `npm run voice -- <slug>` (ElevenLabs).
3. Verifikasi setiap hasil visual lewat `npm run lint`, `npm run stills -- <Id> ... --debug` (inspeksi PNG), `beku.py`, dan `audit.sh`.
4. Jangan pernah membaca isi `.env` ke chat, mencetaknya, atau memasukkannya ke Git.
