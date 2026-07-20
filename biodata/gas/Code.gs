/**
 * ============================================================
 * Student Insight Form — Google Apps Script Backend
 * ============================================================
 * CARA DEPLOY:
 * 1. Buka https://script.google.com → Buat Project baru
 * 2. Copy-paste seluruh isi file ini ke editor
 * 3. Jalankan fungsi setupSpreadsheet() SEKALI untuk membuat database
 * 4. Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy Web App URL → tempel ke GAS_URL di app.js
 * ============================================================
 */

// ── KONFIGURASI ──────────────────────────────────────────────────────────
const CONFIG = {
  SPREADSHEET_NAME: 'Student Insight — Database Profiling Fisika XI',
  SHEET_NAME:       'Responses',
  FORM_NAME:        'Student Insight Form (Backup) — Fisika XI',
};

// ── HEADER KOLOM (sesuai skema Section A–D) ──────────────────────────────
const HEADERS = [
  'Timestamp',
  'Nama Lengkap',
  'Nama Panggilan',
  'Kelas / Rombel',
  'Nomor Absen',
  'Jenis Kelamin',
  'Tempat Lahir',
  'Tanggal Lahir',
  'Alamat Domisili',
  'Nomor HP / WhatsApp',
  'Email Aktif',
  'Nama Orang Tua / Wali',
  'Hobi / Minat',
  'Gaya Belajar',
  'Gaya Mengajar Disukai',
  'Kecepatan Belajar (1-5)',
  'Kendala Belajar Fisika',
  'Media Pembelajaran Favorit',
  'Minat Materi Fisika',
  'Topik Lain',
  'Harapan untuk Kelas Fisika',
];

// ── FIELD KEYS (harus sesuai urutan HEADERS di atas, skip Timestamp) ─────
const FIELD_KEYS = [
  'nama_lengkap',
  'nama_panggilan',
  'kelas',
  'no_absen',
  'jenis_kelamin',
  'tempat_lahir',
  'tanggal_lahir',
  'alamat',
  'no_hp',
  'email',
  'nama_ortu',
  'hobi',
  'gaya_belajar',
  'gaya_mengajar',
  'kecepatan_belajar',
  'kendala_belajar',
  'media_pembelajaran',
  'minat_materi',
  'topik_lain',
  'harapan',
];

// ── SETUP OTOMATIS (jalankan SEKALI oleh guru) ───────────────────────────
function setupSpreadsheet() {
  // Buat Spreadsheet baru
  const ss = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
  const sheet = ss.getActiveSheet();
  sheet.setName(CONFIG.SHEET_NAME);

  // Tulis header
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  // Format header: bold, freeze baris, warna
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4a235a');
  headerRange.setFontColor('#ffffff');
  sheet.setFrozenRows(1);

  // Auto-resize kolom
  sheet.autoResizeColumns(1, HEADERS.length);

  // Simpan Spreadsheet ID ke Script Properties
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

  // Log info penting
  Logger.log('=== SETUP SELESAI ===');
  Logger.log('Spreadsheet ID : ' + ss.getId());
  Logger.log('Spreadsheet URL: ' + ss.getUrl());
  Logger.log('');
  Logger.log('Langkah selanjutnya:');
  Logger.log('1. Deploy script ini sebagai Web App (Execute as: Me, Access: Anyone)');
  Logger.log('2. Copy Web App URL ke GAS_URL di app.js');
  Logger.log('3. (Opsional) Jalankan setupGoogleForm() untuk membuat Form backup');

  // Tampilkan dialog info
  SpreadsheetApp.getUi && SpreadsheetApp.getUi().alert(
    'Setup Selesai!',
    'Spreadsheet berhasil dibuat.\n\nSpreadsheet URL:\n' + ss.getUrl() +
    '\n\nSelanjutnya: Deploy script sebagai Web App dan copy URL ke app.js',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ── SETUP GOOGLE FORM BACKUP (OPSIONAL) ──────────────────────────────────
function setupGoogleForm() {
  const ssId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!ssId) {
    Logger.log('ERROR: Jalankan setupSpreadsheet() terlebih dahulu!');
    return;
  }
  const ss = SpreadsheetApp.openById(ssId);

  // Buat Form
  const form = FormApp.create(CONFIG.FORM_NAME);
  form.setDescription('Form profiling siswa kelas 11 — Fisika Kurikulum Merdeka (backup otomatis)');
  form.setCollectEmail(false);
  form.setShowLinkToRespondAgain(false);

  // Section A — Biodata
  form.addSectionHeaderItem().setTitle('A. Biodata Diri');
  form.addTextItem().setTitle('Nama Lengkap').setRequired(true);
  form.addTextItem().setTitle('Nama Panggilan').setRequired(false);
  const kelasList = form.addListItem().setTitle('Kelas / Rombel').setRequired(true);
  kelasList.setChoiceValues(['XI-1','XI-2','XI-3','XI-4','XI-5','XI-6','XI-7','XI-8','XI-9','XI-10']);
  form.addTextItem().setTitle('Nomor Absen').setRequired(false);
  const jkItem = form.addMultipleChoiceItem().setTitle('Jenis Kelamin').setRequired(true);
  jkItem.setChoiceValues(['Laki-laki', 'Perempuan']);
  form.addTextItem().setTitle('Tempat Lahir').setRequired(true);
  form.addDateItem().setTitle('Tanggal Lahir').setRequired(true);
  form.addParagraphTextItem().setTitle('Alamat Domisili').setRequired(true);
  form.addTextItem().setTitle('Nomor HP / WhatsApp').setRequired(true);
  form.addTextItem().setTitle('Email Aktif').setRequired(true);
  form.addTextItem().setTitle('Nama Orang Tua / Wali').setRequired(false);
  form.addParagraphTextItem().setTitle('Hobi / Minat di Luar Sekolah').setRequired(false);

  // Section B — Gaya Belajar
  form.addSectionHeaderItem().setTitle('B. Gaya Belajar & Mengajar');
  const gbItem = form.addMultipleChoiceItem().setTitle('Gaya belajar yang paling cocok').setRequired(true);
  gbItem.setChoiceValues(['Visual', 'Auditori', 'Kinestetik', 'Membaca-Menulis']);
  const gmItem = form.addCheckboxItem().setTitle('Gaya mengajar guru yang disukai').setRequired(true);
  gmItem.setChoiceValues(['Ceramah interaktif','Diskusi kelompok','Eksperimen / Praktikum','Video & simulasi','Studi kasus kontekstual','Gamifikasi / kuis','Santai & humor','Tegas & terstruktur']);
  const kbItem = form.addScaleItem().setTitle('Kecepatan belajar yang diinginkan').setBounds(1, 5).setLabels('Lambat & mendalam', 'Cepat & ringkas').setRequired(false);
  form.addParagraphTextItem().setTitle('Kendala belajar Fisika selama ini').setRequired(false);
  const mpItem = form.addCheckboxItem().setTitle('Media pembelajaran favorit').setRequired(false);
  mpItem.setChoiceValues(['Video YouTube / streaming','Presentasi PPT / Slide','Modul / buku cetak','Aplikasi simulasi','Infografis / mind map','Podcast / audio']);

  // Section C — Minat Materi
  form.addSectionHeaderItem().setTitle('C. Minat Materi Fisika Kelas 11');
  const mmItem = form.addCheckboxItem().setTitle('Topik materi yang paling menarik (boleh lebih dari satu)').setRequired(false);
  mmItem.setChoiceValues([
    'Hakikat Fisika & Metode Ilmiah',
    'Pengukuran & Ketidakpastian',
    'Gerak Lurus & Melingkar',
    'Hukum Newton & Penerapannya',
    'Usaha, Energi & Daya',
    'Momentum, Impuls & Tumbukan',
    'Getaran, Gelombang & Bunyi',
    'Elastisitas & Hukum Hooke',
    'Fluida Statis & Dinamis',
    'Suhu, Kalor & Perpindahan Kalor',
    'Termodinamika',
  ]);
  form.addTextItem().setTitle('Topik lain yang ingin dipelajari').setRequired(false);

  // Section D — Penutup
  form.addSectionHeaderItem().setTitle('D. Penutup');
  form.addParagraphTextItem().setTitle('Harapan untuk kelas Fisika tahun ini').setRequired(false);
  const consentItem = form.addCheckboxItem().setTitle('Persetujuan Penggunaan Data').setRequired(true);
  consentItem.setChoiceValues(['Saya menyetujui data ini digunakan untuk keperluan pembelajaran']);

  // Link Form ke Spreadsheet yang sudah ada
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ssId);

  Logger.log('=== FORM BACKUP SELESAI DIBUAT ===');
  Logger.log('Form URL (untuk siswa): ' + form.getPublishedUrl());
  Logger.log('Form Edit URL: ' + form.getEditUrl());
  Logger.log('Responses tertaut ke Spreadsheet ID: ' + ssId);
}

// ── doPost — Endpoint penerima data dari front-end ────────────────────────
function doPost(e) {
  try {
    const ssId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!ssId) throw new Error('Spreadsheet ID belum di-setup. Jalankan setupSpreadsheet() dulu.');

    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) throw new Error('Sheet "' + CONFIG.SHEET_NAME + '" tidak ditemukan.');

    // Parse parameter
    const params = e.parameter || {};

    // Validasi field wajib sisi server
    const required = ['nama_lengkap', 'kelas', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'alamat', 'no_hp', 'email'];
    for (const f of required) {
      if (!params[f] || params[f].trim() === '') {
        return jsonResponse({ status: 'error', message: 'Field wajib tidak lengkap: ' + f });
      }
    }

    // Sanitasi: hapus karakter berbahaya dari setiap value
    function sanitize(val) {
      if (!val) return '';
      return String(val).replace(/[<>"'`]/g, '').trim().substring(0, 1000);
    }

    // Susun baris sesuai HEADERS
    const timestamp = new Date();
    const row = [timestamp, ...FIELD_KEYS.map(key => sanitize(params[key]))];

    // Append ke sheet
    sheet.appendRow(row);

    return jsonResponse({ status: 'success', message: 'Data berhasil disimpan.' });

  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return jsonResponse({ status: 'error', message: err.message });
  }
}

// ── doGet — Health check ──────────────────────────────────────────────────
function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Student Insight Form API is running.' });
}

// ── Helper ────────────────────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
