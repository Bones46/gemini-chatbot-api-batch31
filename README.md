AMIN (Asisten Manajemen Internal) 🤖💼

AMIN adalah chatbot asisten cerdas dibuat menggunakan frontend Vanilla JavaScript dan backend Node.js + Express, dan Google Gemini API yang dirancang khusus untuk membantu operasional perusahaan di bidang kelistrikan, instrumentasi, dan manajemen proyek. AMIN bertindak sebagai asisten virtual internal untuk mempercepat pengecekan harga material, penyusunan RKAP (Rencana Kerja dan Anggaran Perusahaan), estimasi RAB, hingga perhitungan margin keuntungan proyek.

🚀 Fitur Utama

🔍 Pencarian Harga Produk & Material: Menarik referensi harga satuan material kelistrikan/jasa secara cepat berdasarkan database internal.

📊 Perencanaan & Anggaran (RKAP): Membantu merancang komponen target finansial dan alokasi anggaran operasional perusahaan.

🧮 Kalkulator RAB & Keuntungan: Menghitung estimasi biaya proyek (HPP), total penawaran, biaya operasional, hingga proyeksi margin keuntungan bersih secara akurat.

🛡️ Strict Guardrails (Batasan Ketat): Dilengkapi System Instruction khusus agar AI hanya fokus menjawab urusan bisnis internal perusahaan dan menolak topik di luar konteks secara sopan.

💬 Integrasi WhatsApp: Terhubung langsung melalui WhatsApp menggunakan library Baileys untuk kemudahan akses tim di lapangan maupun kantor.

🛠️ Tech Stack

Runtime: Node.js (ES Modules)

AI Engine: Google Gemini API (@google/genai, model gemini-2.5-flash)

Utility: Dotenv

📂 Struktur Proyek

gemini-chatbot-api-batch31/
├── index.js              # Entry point & logika utama WhatsApp listener
├── index.js              # Halaman utama interaksi code, Konfigurasi komunikasi & system prompt Gemini API
├── package.json          # Daftar dependensi proyek
└── .env                  # Konfigurasi Environment Variables


⚙️ Cara Instalasi & Menjalankan (Installation)

Ikuti langkah-langkah di bawah ini untuk menjalankan AMIN di komputer atau server lokal Anda:

1. Clone Repositori Ini

git clone https://github.com/username/gemini-chatbot-api-batch31.git
cd gemini-chatbot-api-batch31


2. Instal Dependensi

Pastikan Anda sudah menginstal Node.js di komputer Anda, lalu jalankan:

npm install


3. Konfigurasi Environment Variables

Buat file bernama .env di root folder proyek, lalu masukkan API Key Gemini Anda:

GEMINI_API_KEY=Ganti_Dengan_API_Key_Gemini_Anda_Disini


4. Jalankan Bot

node index.js


5. Hubungkan ke WhatsApp

Terminal akan memunculkan QR Code berbentuk ASCII.

Buka aplikasi WhatsApp di HP Anda -> Pilih Linked Devices (Perangkat Tertaut) -> Link a Device.

Scan QR code yang muncul di terminal.

Jika berhasil, terminal akan menampilkan pesan: "Bot WhatsApp berhasil terhubung dan siap digunakan!"

💡 Contoh Penggunaan via Chat WhatsApp

Kirimkan pesan ke nomor WhatsApp yang terhubung dengan bot, contoh:

"Tolong carikan harga Kabel NYY 4x10mm dan hitung total untuk 100 meter."

"Berapa estimasi keuntungan bersih jika proyek senilai Rp50.000.000 dengan total HPP material Rp35.000.000 dan biaya operasional 10%?"

🛡️ Lisensi

Proyek ini bersifat internal dan dikembangkan untuk kebutuhan operasional perusahaan. Silakan disesuaikan dengan kebutuhan Anda.
