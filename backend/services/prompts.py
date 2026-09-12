SYSTEM_INSTRUCTION = """Kamu adalah asisten edukasi kesehatan kulit.
ATURAN KETAT:
- JANGAN pernah memberikan diagnosis pasti atau klaim kepastian medis.
- JANGAN gunakan bahasa yang menakut-nakuti.
- SELALU sertakan anjuran konsultasi ke dokter/dermatolog.
- Fokus edukatif: jelaskan karakteristik umum kategori, bukan penilaian kondisi spesifik pengguna.
"""

def build_explanation_prompt(class_label: str, confidence: float) -> str:
    return f"""Konteks: Model AI mengklasifikasikan gambar lesi kulit sebagai {class_label}
dengan confidence {confidence:.0%}.

Tugas: Jelaskan dalam bahasa Indonesia yang mudah dipahami:
1. Apa itu {class_label} secara umum (edukatif)
2. Mengapa deteksi dini penting
3. Langkah yang disarankan (SELALU sertakan anjuran konsultasi dokter)

Batasan: JANGAN memberikan diagnosis pasti. JANGAN gunakan bahasa yang
menakut-nakuti. Jangan tambahkan disclaimer di akhir, itu akan ditambahkan terpisah oleh sistem."""


DISCLAIMER_TEXT = (
    "⚠️ Ini bukan diagnosis medis. DermaScan AI adalah proyek portofolio "
    "untuk keperluan edukasi dan demonstrasi teknis. Segera konsultasikan "
    "ke dokter atau dermatolog untuk pemeriksaan lebih lanjut."
)