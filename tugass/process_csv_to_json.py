import pandas as pd
import io
import json

def process_csv_to_json(csv_data):
    try:
        # Membaca data CSV dari string
        csv_file = io.StringIO(csv_data)
        df = pd.read_csv(csv_file)

        # Mapping dari header CSV yang panjang ke kunci JSON yang singkat
        profile_mapping = {
            'NAMA SISWA': 'namaSiswa',
            'Apakah anak anda memiliki riwayat penyakit, alergi atau memiliki kondisi gangguan perkembangan/psikologis tertentu?': 'riwayatPenyakit',
            'Apa saja kebiasaan baik yang sering dilakukan anak anda di rumah ?': 'kebiasaanBaik',
            'Menurut anda apakah ada kebiasaan atau perilaku anak anda yang perlu dirubah ? jika ada tolong dijelaskan': 'perilakuPerluDiubah',
            'bagaimana hubungan pertemanan anak anda?': 'hubunganPertemanan',
            'alasan Anda memilih sekolah ini untuk anak Anda?': 'motivasiSekolah',
            'Hoby': 'hobi',
            'Bakat Murid': 'bakat',
            'Cita – Cita Murid': 'citaCita',
            'Ceritakan tentang diri anda dan keluarga ?': 'infoKeluarga'
        }
        
        # Temukan header yang ada di file CSV berdasarkan mapping
        actual_headers = {}
        for key, partial_header in profile_mapping.items():
            for col in df.columns:
                if key in col:
                    actual_headers[col] = partial_header
                    break
        
        # Ganti nama kolom di DataFrame untuk memudahkan
        df.rename(columns=actual_headers, inplace=True)

        # Pilih hanya kolom yang relevan
        relevant_cols = [col for col in df.columns if col in actual_headers.values()]
        df_relevant = df[relevant_cols]
        
        # Ubah DataFrame ke format JSON
        json_result = df_relevant.to_json(orient='records', indent=2)
        
        return json_result

    except Exception as e:
        return json.dumps([{"error": f"Gagal memproses file: {str(e)}"}], indent=2)
