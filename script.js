let items = [
    {
        id: 1,
        nama: 'Kunci Motor',
        lokasi: 'Gedung G-2.1',
        tanggal: '16 April 2026',
        deskripsi: 'Kunci motor dengan gantungan kunci berbentuk boneka beruang warna cokelat.',
        wa: '081234567890',
        foto: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
        status: 'aktif',
        kodeRahasia: '123',
        tipe: 'temuan',
    },
    {
        id: 2,
        nama: 'Dompet Hitam',
        lokasi: 'Kantin Utara',
        tanggal: '15 April 2026',
        deskripsi: 'Dompet kulit warna hitam, ada KTM di dalamnya.',
        wa: '081298765432',
        foto: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
        status: 'aktif',
        tipe: 'temuan',
    },
   
    
    {
        id: 6,
        nama: 'Kacamata',
        lokasi: 'Gedung F-3.2',
        tanggal: '11 April 2026',
        deskripsi: 'Kacamata minus frame kotak warna silver.',
        wa: '087712345678',
        foto: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
        status: 'aktif',
        tipe: 'temuan',
    },
];

// Flag: apakah section "semua barang" sedang terbuka?
let showAll = false;

// Simpan sementara data foto yang di-upload (base64 string)
let uploadedFiles = {
    hilang: [],
    temuan: [],
};

// Tipe laporan aktif: 'hilang' atau 'temuan'
let tipeLaporan = 'hilang';

// Fungsi toggle — dipanggil saat tombol diklik
function setTipe(tipe) {

    tipeLaporan = tipe;

    const formHilang = document.getElementById('form-hilang');
    const formTemuan = document.getElementById('form-temuan');

    const btnHilang = document.getElementById('btn-tipe-hilang');
    const btnTemuan = document.getElementById('btn-tipe-temuan');

    if (tipe === 'hilang') {

        formHilang.classList.remove('hidden');
        formTemuan.classList.add('hidden');

        btnHilang.className =
            'px-6 py-2.5 rounded-full font-semibold text-sm bg-[#F09B37] text-white transition-all';

        btnTemuan.className =
            'px-6 py-2.5 rounded-full font-semibold text-sm bg-gray-100 text-gray-400 transition-all';

    } else {

        formTemuan.classList.remove('hidden');
        formHilang.classList.add('hidden');

        btnTemuan.className =
            'px-6 py-2.5 rounded-full font-semibold text-sm bg-[#F09B37] text-white transition-all';

        btnHilang.className =
            'px-6 py-2.5 rounded-full font-semibold text-sm bg-gray-100 text-gray-400 transition-all';
    }
}

// 2. LOCALSTORAGE ITEMS
//
//  index.html dan detail-barang.html adalah file BERBEDA.
//  Variabel JS tidak bisa dibagikan langsung antar halaman.
//  localStorage menyimpan data di browser, bisa dibaca semua halaman.


// Simpan array items ke localStorage (dipanggil setiap ada perubahan)
function saveItemsToStorage() {
    localStorage.setItem('lf_items', JSON.stringify(items));
}

// Baca items dari localStorage saat halaman dibuka
function loadItemsFromStorage() {
    const saved = localStorage.getItem('lf_items');
    if (saved) {
        items = JSON.parse(saved);
    } else {
        // Belum ada data — simpan data awal ke storage
        saveItemsToStorage();
    }
}

// Jalankan sekali di awal
loadItemsFromStorage();


// 3. KALENDER — inisialisasi flatpickr pada input tanggal
//    Dibungkus pengecekan agar tidak error di halaman detail

let fpHilang = null;
if (document.getElementById('tanggal-hilang')) {
    fpHilang = flatpickr('#tanggal-hilang', {
        locale: 'id',
        dateFormat: 'd F Y',
        maxDate: 'today',
    });
}

let fpTemuan = null;
if (document.getElementById('tanggal-temuan')) {
    fpTemuan = flatpickr('#tanggal-temuan', {
        locale: 'id',
        dateFormat: 'd F Y',
        maxDate: 'today',
    });
}


// 4. RENDER KARTU — membuat HTML satu kartu barang
//
//    Parameter:
//      item    — objek data barang
//      animate — true = kartu pakai animasi fadeInUp

function createCard(item, animate = false) {
    return `
    <div class="item-card relative
    ${item.status === 'sudah_diklaim'
        ? 'bg-gray-200 opacity-70'
        : 'bg-white'}
    rounded-2xl overflow-hidden shadow-md border border-gray-100
    ${animate ? 'card-new' : ''}">

        <!-- Foto barang -->
        <div class="h-44 bg-gray-100 overflow-hidden relative">
            <img
                src="${item.foto || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400'}"
                alt="${item.nama}"
                class="w-full h-full object-cover"
            >
        </div>
       ${item.status === 'sudah_diklaim'
    ? `<div class="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
         <span class="bg-green-700 text-white text-xs font-bold px-4 py-1.5 rounded-full">SOLVED</span>
       </div>`
    : item.tipe === 'hilang'
        ? `<div class="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">LOST</div>`
        : item.tipe === 'temuan'
            ? `<div class="absolute top-3 right-3 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">FOUND</div>`
            : ''
}
            ${item.status === 'sudah_diklaim'
    ? `
    <div class="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
        <span class="bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-full">
            SOLVED
        </span>
    </div>
    `
    : item.tipe === 'hilang'
    ? `
    <div class="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
        LOST
    </div>
    `
    : `
    <div class="absolute top-3 right-3 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
        FOUND
    </div>
    `
}

        <!-- Info barang -->
        <div class="p-4">
            <h3 class="font-bold text-base mb-1">${item.nama}</h3>

            <!-- Lokasi dengan ikon pin -->
            <p class="flex items-center gap-1 text-gray-500 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                ${item.lokasi}
            </p>

            <!-- Tanggal dengan ikon kalender -->
            <p class="flex items-center gap-1 text-gray-400 text-xs mt-1 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                ${item.tanggal}
            </p>

            <!-- Tombol lihat detail — ?id= agar halaman detail tahu item mana yang dibuka -->
            <a href="detail-barang.html?id=${item.id}"
                class="inline-block bg-[#F09B37] text-white px-4 py-1.5 rounded-full hover:shadow-md hover:shadow-[#F09B37]/30 transition-all font-semibold text-xs">
                lihat detail
            </a>
        </div>

    </div>`;
}


// ──────────────────────────────────────────────────────────────
// 5. RENDER KE GRID — masukkan kartu ke dalam elemen grid
//
//    Parameter:
//      list    — array item yang dirender
//      gridId  — id elemen HTML target
//      limit   — max item (null = semua)
//      animate — animasi fadeInUp
// ──────────────────────────────────────────────────────────────
function renderItems(list, gridId, limit = null, animate = false) {
    const grid = document.getElementById(gridId);
    if (!grid) return; // aman jika elemen tidak ada di halaman ini

    const data = limit ? list.slice(0, limit) : list;
    grid.innerHTML = data.map(item => createCard(item, animate)).join('');
}


// ──────────────────────────────────────────────────────────────
// 6. FILTER / SEARCH — dipanggil tiap user mengetik di search
// ──────────────────────────────────────────────────────────────
function filterItems() {
    const query = document.getElementById('search-input').value.toLowerCase();

    const filtered = items.filter(item =>
        item.nama.toLowerCase().includes(query) ||
        item.lokasi.toLowerCase().includes(query)
    );

    renderItems(filtered, 'items-grid', 2);

    if (showAll) {
        renderItems(filtered, 'all-items-grid');
    }
}


// ──────────────────────────────────────────────────────────────
// 7. TAMPILKAN SEMUA BARANG — klik "lanjut →"
// ──────────────────────────────────────────────────────────────
function showAllItems(e) {
    e.preventDefault();
    showAll = true;

    const section = document.getElementById('semua-barang');
    section.classList.remove('hidden');
    renderItems(items, 'all-items-grid');

    setTimeout(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
}


// ──────────────────────────────────────────────────────────────
// 8. SEMBUNYIKAN SEMUA BARANG — klik "← Kembali"
// ──────────────────────────────────────────────────────────────
function hideAllItems() {
    showAll = false;
    document.getElementById('semua-barang').classList.add('hidden');
    document.getElementById('barang-section').scrollIntoView({ behavior: 'smooth' });
}


// 9. UPLOAD FOTO — klik, drag, drop
function handleFileSelect(event, tipe) {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
        previewFiles(files, tipe);
    }
}

function handleDragOver(e, tipe) {
    e.preventDefault();

    document
        .getElementById(`upload-zone-${tipe}`)
        .classList.add('drag-over');
}

function handleDragLeave(e, tipe) {

    document
        .getElementById(`upload-zone-${tipe}`)
        .classList.remove('drag-over');
}

function handleDrop(e, tipe) {

    e.preventDefault();

    document
        .getElementById(`upload-zone-${tipe}`)
        .classList.remove('drag-over');

    const files = Array.from(e.dataTransfer.files)
        .filter(file => file.type.startsWith('image/'));

    if (files.length > 0) {
        previewFiles(files, tipe);
    }
}

function previewFiles(files, tipe) {

    uploadedFiles[tipe] = [];

    const container =
        document.getElementById(`preview-container-${tipe}`);

    const placeholder =
        document.getElementById(`placeholder-${tipe}`);

    container.innerHTML = '';

    placeholder.classList.add('hidden');
    container.classList.remove('hidden');

    files.forEach(file => {

        const reader = new FileReader();

        reader.onload = (e) => {

            uploadedFiles[tipe].push(e.target.result);

            const img = document.createElement('img');

            img.src = e.target.result;

            img.className =
                'w-full h-28 object-cover rounded-xl';

            container.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
}


// 10. SUBMIT FORM — dipanggil saat tombol "kirim" diklik
function submitItem(tipe) {

    let nama, lokasi, tanggal, wa, deskripsi, kode;

    if (tipe === 'hilang') {

        nama = document.getElementById('nama-hilang').value.trim();
        lokasi = 'Belum diketahui';
        tanggal = document.getElementById('tanggal-hilang').value.trim();
        wa = document.getElementById('wa-hilang').value.trim();
        deskripsi = document.getElementById('deskripsi-hilang').value.trim();
        kode = '';

    } else {

        nama = document.getElementById('nama-temuan').value.trim();
        lokasi = document.getElementById('lokasi-temuan').value.trim();
        tanggal = document.getElementById('tanggal-temuan').value.trim();
        wa = document.getElementById('wa-temuan').value.trim();
        deskripsi = document.getElementById('deskripsi-temuan').value.trim();
        kode = document.getElementById('kode-temuan').value.trim();
    }

    if (!nama || !tanggal) {
        showToast('⚠ Mohon isi data wajib', '#e74c3c');
        return;
    }

    const newItem = {
        id: Date.now(),
        nama,
        lokasi,
        tanggal,
        deskripsi,
        wa,
        foto: uploadedFiles[tipe][0] || null,
        status: 'aktif',

        kodeRahasia: kode,
        tipe: tipe,
    };

    items.unshift(newItem);

    saveItemsToStorage();

    renderItems(items, 'items-grid', 2, true);

    if (showAll) {
        renderItems(items, 'all-items-grid', null, true);
    }

    resetForm();

    showToast('✓ Barang berhasil dilaporkan!');

    setTimeout(() => {
        document.getElementById('barang-section')
            .scrollIntoView({ behavior: 'smooth' });
    }, 600);
}



// 11. RESET FORM — bersihkan input setelah submit
//     Menggunakan helper aman agar tidak error di halaman detail

function resetForm() {

    const ids = [

        'nama-hilang',
        'tanggal-hilang',
        'wa-hilang',
        'deskripsi-hilang',

        'nama-temuan',
        'lokasi-temuan',
        'tanggal-temuan',
        'wa-temuan',
        'deskripsi-temuan',
        'kode-temuan',
    ];

    if (fpHilang) fpHilang.clear();
    if (fpTemuan) fpTemuan.clear();

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

   

    uploadedFiles = {
    hilang: [],
    temuan: [],
};

['hilang', 'temuan'].forEach(tipe => {

    const container =
        document.getElementById(`preview-container-${tipe}`);

    const placeholder =
        document.getElementById(`placeholder-${tipe}`);

    if (container) {
        container.innerHTML = '';
        container.classList.add('hidden');
    }

    if (placeholder) {
        placeholder.classList.remove('hidden');
    }
});
}

// ──────────────────────────────────────────────────────────────
// 12. TOAST NOTIFIKASI — muncul di bawah layar lalu hilang sendiri
// ──────────────────────────────────────────────────────────────
function showToast(msg = '✓ Berhasil!', bg = '#1a1a1a') {
    const toast = document.getElementById('toast');
    if (!toast) return; // aman jika tidak ada di halaman ini
    toast.textContent = msg;
    toast.style.background = bg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}


// ──────────────────────────────────────────────────────────────
// 13. INISIALISASI INDEX — render 2 kartu saat index.html dibuka
// ──────────────────────────────────────────────────────────────
if (document.getElementById('items-grid')) {
    renderItems(items, 'items-grid', 2);
}

//  BAGIAN HALAMAN DETAIL (detail-barang.html)
//  Semua fungsi di bawah hanya aktif jika #detail-nama ada di DOM

// 14. LOAD HALAMAN DETAIL — baca ?id dari URL, isi data ke HTML
//
//  Cara kerja:
//  Saat klik "lihat detail" di kartu → diarahkan ke:
//    detail-barang.html?id=1
//  Di sini kita baca ?id=1, cari di array items, isi ke elemen HTML.
// ──────────────────────────────────────────────────────────────
function loadDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    // Cari item yang id-nya cocok
    const item = items.find(i => i.id === id);

    // Jika tidak ditemukan
    if (!item) {
        const namaEl = document.getElementById('detail-nama');
        if (namaEl) namaEl.textContent = 'Barang tidak ditemukan';
        document.getElementById('detail-lokasi').textContent    = '—';
        document.getElementById('detail-tanggal').textContent   = '—';
        document.getElementById('detail-deskripsi').textContent = 'Data barang tidak tersedia.';
        return;
    }

    // Isi semua elemen dengan data item
    const namaEl = document.getElementById('detail-nama');
    if (namaEl) namaEl.textContent = item.nama;
    document.getElementById('detail-lokasi').textContent    = item.lokasi;
    document.getElementById('detail-tanggal').textContent   = item.tanggal;
    document.getElementById('detail-deskripsi').textContent = item.deskripsi || 'Tidak ada deskripsi tambahan.';

    // Isi foto
    const foto = document.getElementById('detail-foto');
    foto.src = item.foto || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800';
    foto.alt = item.nama;

    // Tombol WhatsApp
    const btnWa = document.getElementById('btn-wa');
    if (item.wa && item.wa.trim() !== '') {
        // Hapus karakter non-angka, ubah awalan 0 → 62
        let nomor = item.wa.trim().replace(/\D/g, '');
        if (nomor.startsWith('0')) nomor = '62' + nomor.slice(1);
        btnWa.href = `https://wa.me/${nomor}`;
    } else {
        // Nonaktifkan tombol jika WA tidak diisi
        btnWa.removeAttribute('href');
        btnWa.innerHTML = 'Nomor WA tidak tersedia';
        btnWa.classList.remove('bg-[#F09B37]', 'hover:bg-[#e08c2a]');
        btnWa.classList.add('bg-gray-200', 'text-gray-400', 'cursor-not-allowed', 'pointer-events-none');
    }

    if (item.status === 'sudah_diklaim') {

    btnWa.removeAttribute('href');

    btnWa.innerHTML = 'Barang sudah ditemukan';

    btnWa.classList.remove(
        'bg-[#F09B37]',
        'hover:bg-[#e08c2a]'
    );

    btnWa.classList.add(
        'bg-gray-300',
        'text-gray-500',
        'pointer-events-none'
    );

    // Tombol found disembunyikan
    const btnFound = document.getElementById('btn-found');

    if (btnFound) {
        btnFound.style.display = 'none';
    }
}

    // Tampilkan komentar untuk item ini
    renderComments(id);
}


// ──────────────────────────────────────────────────────────────
// 15. DATA KOMENTAR — disimpan per item, pakai localStorage
//
//  Format: { [itemId]: [ {nama, teks, waktu}, ... ] }
// ──────────────────────────────────────────────────────────────
let commentsData = {};

function loadCommentsFromStorage() {
    const saved = localStorage.getItem('lf_comments');
    if (saved) {
        commentsData = JSON.parse(saved);
    } else {
        // Komentar contoh untuk item id 1
        commentsData = {
            1: [
                { nama: 'Andi Jati', teks: 'Terima kasih infonya kak!', waktu: '27 April 2026' },
                { nama: 'Rina Sari', teks: 'Apakah itu punya saya? punyaku jg hilang di lantai 2.', waktu: '27 April 2026' },
            ]
        };
        localStorage.setItem('lf_comments', JSON.stringify(commentsData));
    }
}

function saveCommentsToStorage() {
    localStorage.setItem('lf_comments', JSON.stringify(commentsData));
}

// Jalankan sekali di awal
loadCommentsFromStorage();


// ──────────────────────────────────────────────────────────────
// 16. RENDER KOMENTAR — tampilkan daftar komentar ke HTML
// ──────────────────────────────────────────────────────────────

// Template avatar yang dipakai ulang tiap komentar
const avatarSVG = `
<div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>
</div>`;

function renderComments(itemId, animateLast = false) {
    const list       = document.getElementById('comments-list');
    const noComments = document.getElementById('no-comments');
    if (!list) return; // aman jika elemen tidak ada

    const komentar = commentsData[itemId] || [];

    if (komentar.length === 0) {
        list.innerHTML = '';
        noComments.classList.remove('hidden');
        return;
    }

    noComments.classList.add('hidden');

    list.innerHTML = komentar.map((k, index) => `
        <div class="flex items-start gap-4 py-5
            ${index > 0 ? 'border-t border-gray-200' : ''}
            ${animateLast && index === komentar.length - 1 ? 'comment-new' : ''}">
            ${avatarSVG}
            <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                    <h4 class="font-semibold text-gray-800 text-sm">${k.nama}</h4>
                    <span class="text-xs text-gray-400">${k.waktu}</span>
                </div>
                <p class="text-gray-600 text-sm leading-relaxed">${k.teks}</p>
            </div>
        </div>
    `).join('');
}


// ──────────────────────────────────────────────────────────────
// 17. SUBMIT KOMENTAR BARU
//     Dipanggil saat tombol "Kirim" di detail-barang.html diklik
// ──────────────────────────────────────────────────────────────
function submitComment() {
    const params = new URLSearchParams(window.location.search);
    const itemId = parseInt(params.get('id'));

    const nama = document.getElementById('comment-name').value.trim();
    const teks = document.getElementById('comment-text').value.trim();

    if (!nama || !teks) {
        showToast('⚠ Isi nama dan komentar dulu ya!', '#e74c3c');
        return;
    }

    const komentarBaru = {
        nama,
        teks,
        // Format tanggal: "14 Mei 2026"
        waktu: new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        })
    };

    // Tambah ke array komentar item ini
    if (!commentsData[itemId]) commentsData[itemId] = [];
    commentsData[itemId].push(komentarBaru);

    // Simpan ke localStorage agar tidak hilang saat refresh
    saveCommentsToStorage();

    // Re-render dengan animasi di komentar terakhir
    renderComments(itemId, true);

    // Kosongkan input
    document.getElementById('comment-name').value = '';
    document.getElementById('comment-text').value = '';

    showToast('✓ Komentar berhasil dikirim!');
}


// ──────────────────────────────────────────────────────────────
// 18. INISIALISASI DETAIL — hanya jalan di detail-barang.html
// ──────────────────────────────────────────────────────────────
if (document.getElementById('detail-deskripsi')) {
    loadDetailPage();
}

function markAsFound() {

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    const item = items.find(i => i.id === id);

    if (!item) return;

    // Tanya kode
    const kode = prompt('masukkan kode verifikasi yang diberikan oleh penemu untuk memverifikasi kepemilikan anda');

    // Jika salah
    if (kode !== item.kodeRahasia) {
        showToast('⚠ Kode salah!', '#e74c3c');
        return;
    }

    // Ubah status
    item.status = 'sudah_diklaim';

    // Simpan
    saveItemsToStorage();

    // Notifikasi
    showToast('✓ Barang ditandai ditemukan');

    // Reload
    setTimeout(() => {
        location.reload();
    }, 1000);
}