/* ============================================================
   STUDENT INSIGHT FORM — app.js
   Multi-step navigation, validation, submit to Google Apps Script
   ============================================================ */

'use strict';

// ── CONFIG ─────────────────────────────────────────────────────────────
// Ganti URL ini dengan Web App URL Google Apps Script setelah deploy
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwqwp85G-TdclUZzmbSjjDkJmps6ez05LANSnJrZhpkhoAUdR1CC4oRqWTti1MslqVe/exec';

// ── STATE ───────────────────────────────────────────────────────────────
let currentStep = 0; // 0 = intro

// ── SCREEN HELPERS ──────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function goToStep(step) {
  showScreen('screen-form');
  activateStep(step);
}

function activateStep(step) {
  currentStep = step;
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const stepEl = document.getElementById(`step-${step}`);
  if (stepEl) stepEl.classList.add('active');
  updateProgress(step);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(step) {
  const progressEl = document.querySelector('.progress-wrapper');
  if (progressEl) progressEl.setAttribute('aria-valuenow', step);

  document.querySelectorAll('.progress-step').forEach(el => {
    const s = parseInt(el.dataset.step);
    el.classList.remove('active', 'done');
    if (s === step) el.classList.add('active');
    if (s < step)  el.classList.add('done');
  });

  document.querySelectorAll('.progress-line').forEach((el, i) => {
    el.classList.toggle('done', i < step - 1);
  });
}

// ── NAVIGATION ──────────────────────────────────────────────────────────
function nextStep(from) {
  if (!validateStep(from)) return;
  if (from < 4) activateStep(from + 1);
}

function prevStep(from) {
  if (from > 1) activateStep(from - 1);
  else showScreen('screen-intro');
}

// ── VALIDATION ──────────────────────────────────────────────────────────
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
}

function setError(fieldId, message) {
  const errEl = document.getElementById(`err-${fieldId}`);
  if (errEl) errEl.textContent = message;
  const inputEl = document.getElementById(fieldId) || document.querySelector(`[name="${fieldId}"]`);
  if (inputEl) inputEl.classList.add('invalid');
}

function validateStep(step) {
  clearErrors();
  let valid = true;

  if (step === 1) {
    const nama = val('nama_lengkap');
    if (!nama) { setError('nama_lengkap', 'Nama lengkap wajib diisi.'); valid = false; }

    const kelas = val('kelas');
    if (!kelas) { setError('kelas', 'Pilih kelas terlebih dahulu.'); valid = false; }

    const jk = document.querySelector('input[name="jenis_kelamin"]:checked');
    if (!jk) { setError('jenis_kelamin', 'Pilih jenis kelamin.'); valid = false; }

    const ttl = val('tempat_lahir');
    if (!ttl) { setError('tempat_lahir', 'Tempat lahir wajib diisi.'); valid = false; }

    const tgl = val('tanggal_lahir');
    if (!tgl) { setError('tanggal_lahir', 'Tanggal lahir wajib diisi.'); valid = false; }

    const alamat = val('alamat');
    if (!alamat) { setError('alamat', 'Alamat wajib diisi.'); valid = false; }

    const hp = val('no_hp');
    if (!hp) {
      setError('no_hp', 'Nomor HP wajib diisi.'); valid = false;
    } else if (!/^(\+62|0)[0-9]{8,13}$/.test(hp.replace(/[\s-]/g, ''))) {
      setError('no_hp', 'Format nomor HP tidak valid. Contoh: 08123456789'); valid = false;
    }

    const email = val('email');
    if (!email) {
      setError('email', 'Email wajib diisi.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Format email tidak valid.'); valid = false;
    }
  }

  if (step === 2) {
    const gb = document.querySelector('input[name="gaya_belajar"]:checked');
    if (!gb) { setError('gaya_belajar', 'Pilih salah satu gaya belajar.'); valid = false; }

    const gm = document.querySelectorAll('input[name="gaya_mengajar"]:checked');
    if (gm.length === 0) { setError('gaya_mengajar', 'Pilih minimal satu gaya mengajar.'); valid = false; }
  }

  if (step === 4) {
    const consent = document.getElementById('consent');
    if (!consent.checked) {
      setError('consent', 'Kamu perlu menyetujui pernyataan di atas untuk melanjutkan.'); valid = false;
    }
  }

  if (!valid) {
    // Focus first invalid field
    const firstErr = document.querySelector('.invalid, .field-error:not(:empty)');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

// ── FORM DATA COLLECTION ────────────────────────────────────────────────
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function collectFormData() {
  return {
    timestamp:        new Date().toISOString(),
    nama_lengkap:     val('nama_lengkap'),
    nama_panggilan:   val('nama_panggilan'),
    kelas:            val('kelas'),
    no_absen:         val('no_absen'),
    jenis_kelamin:    (document.querySelector('input[name="jenis_kelamin"]:checked') || {}).value || '',
    tempat_lahir:     val('tempat_lahir'),
    tanggal_lahir:    val('tanggal_lahir'),
    alamat:           val('alamat'),
    no_hp:            val('no_hp'),
    email:            val('email'),
    nama_ortu:        val('nama_ortu'),
    hobi:             val('hobi'),
    gaya_belajar:     (document.querySelector('input[name="gaya_belajar"]:checked') || {}).value || '',
    gaya_mengajar:    [...document.querySelectorAll('input[name="gaya_mengajar"]:checked')].map(el => el.value).join(', '),
    kecepatan_belajar: val('kecepatan_belajar'),
    kendala_belajar:  val('kendala_belajar'),
    media_pembelajaran: [...document.querySelectorAll('input[name="media_pembelajaran"]:checked')].map(el => el.value).join(', '),
    minat_materi:     [...document.querySelectorAll('input[name="minat_materi"]:checked')].map(el => el.value).join(', '),
    topik_lain:       val('topik_lain'),
    harapan:          val('harapan'),
  };
}

// ── SUBMIT ──────────────────────────────────────────────────────────────
async function submitForm() {
  if (!validateStep(4)) return;

  const btn = document.getElementById('btn-submit');
  if (btn) { btn.disabled = true; }

  showScreen('screen-loading');

  const data = collectFormData();

  try {
    // Google Apps Script CORS workaround: use no-cors with URL-encoded body
    const body = new URLSearchParams(data).toString();

    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    });

    showThankyou(data);

  } catch (err) {
    console.error('Submit error:', err);
    // Tetap tampilkan halaman sukses karena no-cors selalu return opaque response
    // (tidak ada cara membedakan success/fail dengan no-cors)
    showThankyou(data);
  }
}

// ── THANK YOU SCREEN ────────────────────────────────────────────────────
function showThankyou(data) {
  // Generate fun insight based on answers
  const insight = generateInsight(data);
  const insightEl = document.getElementById('ty-insight');
  if (insightEl && insight) {
    insightEl.innerHTML = insight;
  }
  showScreen('screen-thankyou');
}

function generateInsight(data) {
  const insights = [];

  if (data.gaya_belajar) {
    const icons = {
      'Visual': '🎨',
      'Auditori': '🎧',
      'Kinestetik': '🤸',
      'Membaca-Menulis': '📖',
    };
    const icon = icons[data.gaya_belajar] || '✨';
    insights.push(`${icon} Gaya belajarmu: <strong>${data.gaya_belajar}</strong>`);
  }

  if (data.minat_materi) {
    const topics = data.minat_materi.split(', ');
    if (topics.length > 0 && topics[0]) {
      insights.push(`⭐ Topik favoritmu: <strong>${topics[0]}</strong>${topics.length > 1 ? ` dan ${topics.length - 1} lainnya` : ''}`);
    }
  }

  if (data.nama_panggilan) {
    return `<p>Hei <strong>${data.nama_panggilan}</strong>! Berikut profil singkatmu:</p>
            <ul style="margin-top:0.5rem;padding-left:1.25rem;line-height:1.9;">
              ${insights.map(i => `<li>${i}</li>`).join('')}
            </ul>`;
  } else if (insights.length > 0) {
    return `<ul style="margin:0;padding-left:1.25rem;line-height:1.9;">
              ${insights.map(i => `<li>${i}</li>`).join('')}
            </ul>`;
  }
  return '';
}

// ── RANGE SLIDER LIVE LABEL ──────────────────────────────────────────────
function initRangeSlider() {
  const slider = document.getElementById('kecepatan_belajar');
  const display = document.getElementById('kecepatan-display');
  if (!slider || !display) return;

  const labels = { 1: '🐢 Lambat & mendalam (1)', 2: 'Agak lambat (2)', 3: 'Seimbang (3)', 4: 'Agak cepat (4)', 5: '🚀 Cepat & ringkas (5)' };

  function updateSliderDisplay() {
    const v = parseInt(slider.value);
    display.textContent = labels[v] || v;
    slider.setAttribute('aria-valuenow', v);
    // Update gradient fill
    const pct = ((v - 1) / 4) * 100;
    slider.style.background = `linear-gradient(to right, var(--clr-primary) ${pct}%, rgba(255,255,255,0.15) ${pct}%)`;
  }

  slider.addEventListener('input', updateSliderDisplay);
  updateSliderDisplay();
}

// ── TOPIC CARD KEYBOARD SUPPORT ─────────────────────────────────────────
function initTopicCards() {
  document.querySelectorAll('.topic-card, .bento-option-card, .radio-card, .checkbox-card').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const input = card.querySelector('input');
        if (input) {
          if (input.type === 'checkbox') input.checked = !input.checked;
          else input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
    // Make card focusable
    if (!card.getAttribute('tabindex')) card.setAttribute('tabindex', '0');
  });
}

// ── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initRangeSlider();
  initTopicCards();
});
