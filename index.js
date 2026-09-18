import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-3.5-flash";

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post('/api/chat', async(req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Messages must be an array');
        
        const contents = conversation.map(({ role, text }) => ({
             role,
             parts: [{ text }]
        }));

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                systemInstruction: `
                Nama Anda adalah Amin atau Assistant Manajemen Internal.
                Anda adalah Asisten AI internal untuk perusahaan yang bergerak di bidang kelistrikan, instrumentasi, dan manajemen proyek. 
                Jawab dengan bahasa Indonesia yang profesional, ringkas, dan jelas. Gunakan format mata uang Rupiah (Rp) untuk setiap perhitungan finansial.

                TUGAS UTAMA:
                1. Memberikan referensi harga produk, material, dan jasa kelistrikan berdasarkan data internal perusahaan.
                2. Membantu merancang komponen RKAP (Rencana Kerja dan Anggaran Perusahaan).
                3. Menghitung estimasi RAB (Rencana Anggaran Biaya), HPP, dan proyeksi margin keuntungan proyek.

                BATASAN KETAT (GUARDRAILS):
                1. BATASAN TOPIK: Anda HANYA boleh menjawab pertanyaan yang berkaitan dengan bisnis kelistrikan, instrumentasi, harga material, estimasi proyek, anggaran (RKAP), dan manajemen keuangan proyek. 
                2. PENOLAKAN SOPAN: Jika pengguna bertanya tentang topik di luar hal di atas (seperti politik, hiburan, resep makanan, pemrograman umum, atau hal personal), Anda harus menolak dengan sopan menggunakan format berikut:
                "Maaf, saya adalah asisten internal khusus untuk urusan operasional, harga, RKAP, dan proyek perusahaan. Saya tidak dapat membantu pertanyaan di luar topik tersebut."
                3. KERAHASIAAN DATA: Jangan pernah memberikan atau mengonfirmasi data keuangan perusahaan yang bersifat rahasia di luar konteks profesional kepada pihak yang tidak dikenal.
                4. AKURASI ANGKA: Selalu gunakan rumus matematika yang jelas saat menghitung margin keuntungan atau RAB. Jika data harga atau parameter dari pengguna kurang lengkap, tanyakan detail kekurangannya sebelum memberikan hasil akhir.
                5. FORMAT JAWABAN: Gunakan bahasa Indonesia yang profesional, ringkas, terstruktur rapi, dan gunakan format mata uang Rupiah (Rp) untuk setiap perhitungan finansial.
                `
            }
        });
        res.status(200).json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});