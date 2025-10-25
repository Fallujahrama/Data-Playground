/**
 * Data Playground - Script.js
 * File ini berisi seluruh logika interaktif untuk aplikasi Data Playground Statistika
 */

// ===== VARIABEL GLOBAL =====

// Variabel untuk menyimpan chart histogram yang akan diperbarui
let histogramChart;
let histogramChartKelompok;
let histogramAdditionalChart = null;
let histogramKelompokAdditionalChart = null;

// Data awal yang ditampilkan saat aplikasi pertama kali dijalankan
let currentData = [10, 12, 9, 15, 20, 18, 14];

// Data asli yang akan disimpan untuk perbandingan
let originalData = {
  values: [],
  n: 0,
  mean: 0,
  median: 0,
  mode: '-'
};

let originalDataKelompok = {
  intervals: [],
  n: 0,
  mean: 0,
  median: 0,
  mode: '-'
};

// Data awal untuk data kelompok (format: [[batas_bawah, batas_atas, frekuensi], ...])
let currentDataKelompok = [
  [1, 10, 5],
  [11, 20, 8],
  [21, 30, 12]
];

// ===== DATA TUGAS UNTUK SETIAP SISWA =====

// Daftar tugas untuk data tunggal
const tugasDataTunggal = [
  "Masukkan data tinggi badan (dalam cm) teman sekelas Anda (minimal 10 data)",
  "Masukkan data berat badan (dalam kg) teman sekelas Anda (minimal 10 data)",
  "Masukkan data usia (dalam tahun) teman sekelas Anda (minimal 10 data)",
  "Masukkan data nilai ujian matematika teman sekelas Anda (minimal 10 data)",
  "Masukkan data jumlah kehadiran sekolah dalam satu bulan teman sekelas Anda (minimal 10 data)",
  "Masukkan data jumlah saudara kandung teman sekelas Anda (minimal 10 data)",
  "Masukkan data lama waktu perjalanan ke sekolah (dalam menit) teman sekelas Anda (minimal 10 data)",
  "Masukkan data uang saku harian (dalam ribuan rupiah) teman sekelas Anda (minimal 10 data)",
  "Masukkan data jumlah jam tidur per hari teman sekelas Anda (minimal 10 data)",
  "Masukkan data jumlah buku yang dibaca per bulan oleh teman sekelas Anda (minimal 10 data)",
  "Masukkan data waktu penggunaan gadget per hari (dalam jam) teman sekelas Anda (minimal 10 data)"
];

// Daftar tugas untuk data kelompok
const tugasDataKelompok = [
  "Masukkan data kelompok tinggi badan (dalam cm) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok berat badan (dalam kg) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok usia (dalam tahun) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok nilai ujian statistika teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok waktu belajar per hari (dalam menit) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok jarak rumah ke sekolah (dalam km) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok uang saku bulanan (dalam ribuan rupiah) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok nilai rata-rata rapor teman sekelas Anda (skala 0-100, minimal 5 kelompok)",
  "Masukkan data kelompok jumlah kehadiran sekolah per bulan teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok waktu mengerjakan PR (dalam menit) teman sekelas Anda (minimal 5 kelompok)"
];

// Variabel untuk menyimpan tugas yang di-generate
let currentTask = null;

// ===== INISIALISASI APLIKASI =====

/**
 * Fungsi sederhana untuk hash string menjadi angka
 * Digunakan untuk menghasilkan tugas yang konsisten berdasarkan Nama/ID siswa
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Fungsi untuk generate tugas berdasarkan Nama/ID siswa
 */
function generateTask() {
  const studentId = document.getElementById("studentId").value.trim();
  
  if (!studentId) {
    alert("Silakan masukkan Nama/NISN Anda terlebih dahulu!");
    return;
  }
  
  // Hash Nama/NISN siswa untuk mendapatkan index yang konsisten
  const hash = hashString(studentId.toLowerCase());
  
  // Pilih tugas berdasarkan hash (akan selalu sama untuk ID yang sama)
  const indexTunggal = hash % tugasDataTunggal.length;
  const indexKelompok = hash % tugasDataKelompok.length;
  
  // Simpan tugas yang di-generate
  currentTask = {
    studentId: studentId,
    tugalTunggal: tugasDataTunggal[indexTunggal],
    tugalKelompok: tugasDataKelompok[indexKelompok]
  };
  
  // Tampilkan instruksi tugas
  const taskText = `
    <strong>Untuk ${studentId}:</strong><br><br>
    <strong>Data Tunggal:</strong> ${currentTask.tugalTunggal}<br>
    <strong>Data Kelompok:</strong> ${currentTask.tugalKelompok}
  `;
  
  document.getElementById("taskText").innerHTML = taskText;
  document.getElementById("taskInstruction").style.display = "block";
  
  // Scroll ke instruksi
  document.getElementById("taskInstruction").scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Fungsi yang dijalankan saat halaman dimuat
 * Memproses data awal dan menginisialisasi chart
 */
window.onload = function() {
  // Tambahkan event listener untuk checkbox tampilkan langkah
  document.getElementById("showSteps").addEventListener("change", toggleLangkahPerhitungan);
  document.getElementById("showStepsKelompok").addEventListener("change", toggleLangkahPerhitunganKelompok);
  
  // Jangan proses data awal karena textarea kosong
  // prosesData();
  // initChart(currentData);
  
  // Jangan initialize data kelompok juga
  // prosesDataKelompok();
  // initChartKelompok(currentDataKelompok);
};

/**
 * Fungsi untuk beralih antar tab utama (data tunggal atau data kelompok)
 * @param {string} tabName - Nama tab yang akan ditampilkan ("dataTunggal" atau "dataKelompok")
 */
function showMainTab(tabName) {
  // Sembunyikan semua tab content
  document.querySelectorAll('.main-tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Nonaktifkan semua tombol tab
  document.querySelectorAll('.main-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Tampilkan tab yang dipilih
  document.getElementById(tabName + '-tab').classList.add('active');
  
  // Aktifkan tombol yang diklik (cari berdasarkan onclick attribute)
  document.querySelectorAll('.main-tab-btn').forEach(btn => {
    if (btn.getAttribute('onclick').includes(tabName)) {
      btn.classList.add('active');
    }
  });
}

/**
 * Fungsi untuk menampilkan atau menyembunyikan langkah perhitungan saat checkbox berubah
 * Dijalankan langsung saat checkbox diklik
 */
function toggleLangkahPerhitungan() {
  const showSteps = document.getElementById("showSteps").checked;
  const output = document.getElementById("output");
  
  if (showSteps) {
    // Jika checkbox dicentang, jalankan prosesData untuk menampilkan langkah perhitungan
    prosesData();
  } else {
    // Jika checkbox tidak dicentang, kosongkan area output
    output.innerHTML = "";
  }
}

/**
 * Fungsi untuk memuat dataset contoh secara acak
 * Dijalankan saat user klik tombol "Contoh Dataset"
 */
function loadContohData() {
  // Dataset contoh yang bisa dipilih secara acak
  let datasets = [
    [
      [10, 1], [12, 1], [9, 1], [15, 2], [20, 1], [18, 1], [14, 1]
    ],
    [
      [23, 1], [45, 2], [67, 1], [89, 1], [12, 1], [34, 1], [56, 1], [78, 1], [90, 1]
    ],
    [
      [5, 1], [10, 1], [15, 2], [20, 2], [25, 1], [30, 1], [35, 1], [40, 1], [45, 1], [50, 1]
    ],
    [
      [72, 2], [75, 1], [71, 2], [73, 1], [74, 2], [76, 1]
    ]
  ];
  
  // Memilih dataset secara acak
  let randomIndex = Math.floor(Math.random() * datasets.length);
  let selectedDataset = datasets[randomIndex];
  
  // Kosongkan tabel terlebih dahulu
  const tbody = document.getElementById("dataTunggalTableBody");
  tbody.innerHTML = "";
  
  // Isi tabel dengan data contoh
  selectedDataset.forEach(([nilai, jumlah]) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="number" class="nilai-input" value="${nilai}" step="any" /></td>
      <td><input type="number" class="jumlah-input" value="${jumlah}" min="1" /></td>
      <td><button class="delete-row-btn" onclick="deleteRowTunggal(this)">🗑️</button></td>
    `;
    tbody.appendChild(newRow);
  });
  
  // Proses dataset yang dipilih
  prosesDataFromTable();
}

/**
 * Fungsi untuk membersihkan semua data dan menghapus tampilan statistik
 * Dijalankan saat user klik tombol "Kosongkan"
 */
function clearData() {
  // Kosongkan tabel - reset ke 1 baris kosong
  const tbody = document.getElementById("dataTunggalTableBody");
  tbody.innerHTML = `
    <tr>
      <td><input type="number" class="nilai-input" placeholder="15" step="any" /></td>
      <td><input type="number" class="jumlah-input" placeholder="3" min="1" /></td>
      <td><button class="delete-row-btn" onclick="deleteRowTunggal(this)">🗑️</button></td>
    </tr>
  `;
  
  // Kosongkan area output dan tabel
  document.getElementById("output").innerHTML = "";
  document.getElementById("tableOutput").innerHTML = "";
  
  // Reset informasi jumlah data
  document.getElementById("dataCount").textContent = "Data saat ini: 0 nilai";
  
  // Reset nilai statistik di kartu
  document.getElementById("n-value").textContent = "0";
  document.getElementById("mean-value").textContent = "0.00";
  document.getElementById("median-value").textContent = "0";
  document.getElementById("mode-value").textContent = "-";
  
  // Sembunyikan section nilai tambahan
  document.getElementById("additionalDataSection").style.display = "none";
  
  // Reset tabel nilai tambahan
  const additionalTbody = document.getElementById("additionalDataTableBody");
  additionalTbody.innerHTML = `
    <tr>
      <td><input type="number" class="nilai-input" placeholder="25" step="any" /></td>
      <td><input type="number" class="jumlah-input" placeholder="1" min="1" value="1" /></td>
    </tr>
    <tr>
      <td><input type="number" class="nilai-input" placeholder="30" step="any" /></td>
      <td><input type="number" class="jumlah-input" placeholder="1" min="1" value="1" /></td>
    </tr>
    <tr>
      <td><input type="number" class="nilai-input" placeholder="35" step="any" /></td>
      <td><input type="number" class="jumlah-input" placeholder="1" min="1" value="1" /></td>
    </tr>
    <tr>
      <td><input type="number" class="nilai-input" placeholder="40" step="any" /></td>
      <td><input type="number" class="jumlah-input" placeholder="1" min="1" value="1" /></td>
    </tr>
    <tr>
      <td><input type="number" class="nilai-input" placeholder="45" step="any" /></td>
      <td><input type="number" class="jumlah-input" placeholder="1" min="1" value="1" /></td>
    </tr>
  `;
  
  // Hapus chart jika ada
  if (histogramChart) {
    histogramChart.destroy();
  }
  
  // Reset data original
  originalData = {
    values: [],
    n: 0,
    mean: 0,
    median: 0,
    mode: '-'
  };
}

/**
 * Fungsi untuk berpindah tab antara histogram dan tabel
 * @param {string} tabName - Nama tab yang akan ditampilkan ("histogram" atau "table")
 */
function showTab(tabName) {
  // Sembunyikan semua tab
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Nonaktifkan semua tombol tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Tampilkan tab yang dipilih
  document.getElementById(tabName + '-tab').classList.add('active');
  
  // Aktifkan tombol yang diklik
  event.currentTarget.classList.add('active');
}

/**
 * Fungsi untuk membuat histogram dari data tunggal
 * Menampilkan frekuensi untuk setiap nilai unik
 * @param {Array} data - Array berisi nilai data yang akan divisualisasi
 */
function createHistogram(data) {
  // Hapus chart yang sudah ada jika ada
  if (histogramChart) {
    histogramChart.destroy();
  }
  
  // Jika tidak ada data yang valid, keluar dari fungsi
  if (data.length === 0) {
    return;
  }
  
  // Hitung frekuensi untuk setiap nilai unik
  let frequency = {};
  data.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
  });
  
  // Urutkan nilai-nilai unik
  let uniqueValues = Object.keys(frequency).map(Number).sort((a, b) => a - b);
  
  // Buat label dan data untuk chart
  let labels = uniqueValues.map(String); // Nilai tunggal seperti "35", "40", "45"
  let chartData = uniqueValues.map(val => frequency[val]);
  
  // Buat chart dengan Chart.js
  let ctx = document.getElementById('histogramChart').getContext('2d');
  histogramChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Frekuensi',
        data: chartData,
        backgroundColor: 'rgba(26, 115, 232, 0.8)',
        borderColor: 'rgba(26, 115, 232, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frekuensi'
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          title: {
            display: true,
            text: 'Nilai'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      }
    }
  });
}

/**
 * Fungsi untuk menginisialisasi chart
 * @param {Array} data - Array data yang akan digunakan untuk membuat chart
 */
function initChart(data) {
  createHistogram(data);
}

/**
 * Fungsi untuk membersihkan tampilan statistik
 * Digunakan di dalam fungsi prosesData
 */
function clearStatistics() {
  document.getElementById("dataCount").textContent = "Data saat ini: 0 nilai";
  document.getElementById("n-value").textContent = "0";
  document.getElementById("mean-value").textContent = "0.00";
  document.getElementById("median-value").textContent = "0";
  document.getElementById("mode-value").textContent = "-";
  document.getElementById("tableOutput").innerHTML = "";
  
  // Reset chart
  if (histogramChart) {
    histogramChart.destroy();
  }
}

// ===== FUNGSI UNTUK TABEL INPUT DATA TUNGGAL =====

/**
 * Fungsi untuk menambah baris baru pada tabel input data tunggal
 */
function addRowTunggal() {
  const tbody = document.getElementById("dataTunggalTableBody");
  const newRow = document.createElement("tr");
  
  newRow.innerHTML = `
    <td><input type="number" class="nilai-input" placeholder="20" step="any" /></td>
    <td><input type="number" class="jumlah-input" placeholder="2" min="1" /></td>
    <td><button class="delete-row-btn" onclick="deleteRowTunggal(this)">🗑️</button></td>
  `;
  
  tbody.appendChild(newRow);
}

/**
 * Fungsi untuk menghapus baris dari tabel input data tunggal
 */
function deleteRowTunggal(button) {
  const tbody = document.getElementById("dataTunggalTableBody");
  const rows = tbody.getElementsByTagName("tr");
  
  // Jangan izinkan menghapus jika hanya tersisa 1 baris
  if (rows.length <= 1) {
    alert("Minimal harus ada 1 baris data!");
    return;
  }
  
  const row = button.parentNode.parentNode;
  row.remove();
}

/**
 * Fungsi untuk memproses data dari tabel input data tunggal
 */
function prosesDataFromTable() {
  console.log("prosesDataFromTable dipanggil");
  const tbody = document.getElementById("dataTunggalTableBody");
  
  if (!tbody) {
    console.error("Tabel tidak ditemukan!");
    alert("Error: Tabel input tidak ditemukan!");
    return;
  }
  
  const rows = tbody.getElementsByTagName("tr");
  console.log("Jumlah baris:", rows.length);
  
  // Reset output area
  document.getElementById("output").innerHTML = "";
  
  let data = [];
  let hasError = false;
  
  // Ambil data dari setiap baris tabel
  for (let i = 0; i < rows.length; i++) {
    const nilaiInput = rows[i].querySelector(".nilai-input");
    const jumlahInput = rows[i].querySelector(".jumlah-input");
    
    if (!nilaiInput || !jumlahInput) {
      console.error(`Baris ${i + 1}: Input tidak ditemukan`);
      continue;
    }
    
    const nilaiValue = nilaiInput.value.trim();
    const jumlahValue = jumlahInput.value.trim();
    
    console.log(`Baris ${i + 1}: Nilai=${nilaiValue}, Jumlah=${jumlahValue}`);
    
    // Skip baris kosong
    if (!nilaiValue && !jumlahValue) {
      console.log(`Baris ${i + 1}: Kosong, di-skip`);
      continue;
    }
    
    // Validasi input
    if (!nilaiValue || !jumlahValue) {
      alert(`Baris ${i + 1}: Harap isi nilai dan jumlah!`);
      hasError = true;
      break;
    }
    
    const nilai = parseFloat(nilaiValue);
    const jumlah = parseInt(jumlahValue);
    
    if (isNaN(nilai) || isNaN(jumlah)) {
      alert(`Baris ${i + 1}: Nilai harus berupa angka!`);
      hasError = true;
      break;
    }
    
    if (jumlah < 1) {
      alert(`Baris ${i + 1}: Jumlah harus minimal 1!`);
      hasError = true;
      break;
    }
    
    // Tambahkan nilai sebanyak jumlah yang ditentukan
    for (let j = 0; j < jumlah; j++) {
      data.push(nilai);
    }
  }
  
  console.log("Data yang dikumpulkan:", data);
  
  if (hasError) {
    clearStatistics();
    return;
  }
  
  if (data.length === 0) {
    alert("Tidak ada data yang dimasukkan!");
    clearStatistics();
    return;
  }
  
  // Urutkan data
  let sorted = [...data].sort((a, b) => a - b);
  
  console.log("Data setelah diurutkan:", sorted);
  
  // Update variabel global
  currentData = sorted;
  
  // Update informasi jumlah data
  document.getElementById("dataCount").textContent = `Data saat ini: ${sorted.length} nilai`;
  
  // ===== PERHITUNGAN STATISTIK =====
  
  // Hitung mean (rata-rata)
  let sum = sorted.reduce((a, b) => a + b, 0);
  let mean = sum / sorted.length;
  
  // Hitung median (nilai tengah)
  let median = (sorted.length % 2 === 1)
    ? sorted[Math.floor(sorted.length/2)]  // Jika ganjil, ambil nilai tengah
    : (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2; // Jika genap, ambil rata-rata dua nilai tengah
  
  // Hitung modus (nilai yang paling sering muncul)
  let freq = {};
  sorted.forEach(v => freq[v] = (freq[v] || 0) + 1); // Hitung frekuensi masing-masing nilai
  let mode = Object.keys(freq).reduce((a,b) => freq[a] > freq[b] ? a : b); // Temukan nilai dengan frekuensi tertinggi
  
  // Update statistik cards
  document.getElementById("n-value").textContent = sorted.length;
  document.getElementById("mean-value").textContent = mean.toFixed(2);
  document.getElementById("median-value").textContent = median;
  document.getElementById("mode-value").textContent = mode;
  
  // Update tabel preview
  let tableHtml = "<table><tr><th>No.</th><th>Data</th></tr>";
  for (let i = 0; i < sorted.length; i++) {
    tableHtml += `<tr><td>${i + 1}</td><td>${sorted[i]}</td></tr>`;
  }
  tableHtml += "</table>";
  document.getElementById("tableOutput").innerHTML = tableHtml;
  
  // Tampilkan langkah perhitungan jika checkbox dicentang
  if (document.getElementById("showSteps").checked) {
    tampilkanLangkahPerhitungan(sorted, mean, median, mode);
  }
  
  // Buat histogram - PENTING: Ini harus dipanggil!
  createHistogram(sorted);
  
  // Simpan data original untuk perbandingan
  originalData = {
    values: sorted,
    n: sorted.length,
    mean: mean,
    median: median,
    mode: mode
  };
  
  // Tampilkan section untuk input 5 nilai tambahan
  document.getElementById("additionalDataSection").style.display = "block";
}

/**
 * Fungsi untuk memproses data dengan menambahkan 5 nilai tambahan
 */
function prosesDataWithAdditional() {
  console.log("prosesDataWithAdditional dipanggil");
  
  // Ambil data dari tabel utama
  const mainTbody = document.getElementById("dataTunggalTableBody");
  const mainRows = mainTbody.getElementsByTagName("tr");
  
  // Ambil data dari tabel tambahan
  const additionalTbody = document.getElementById("additionalDataTableBody");
  const additionalRows = additionalTbody.getElementsByTagName("tr");
  
  let data = [];
  let hasError = false;
  
  // Ambil data dari tabel utama
  for (let i = 0; i < mainRows.length; i++) {
    const nilaiInput = mainRows[i].querySelector(".nilai-input");
    const jumlahInput = mainRows[i].querySelector(".jumlah-input");
    
    const nilaiValue = nilaiInput.value.trim();
    const jumlahValue = jumlahInput.value.trim();
    
    if (!nilaiValue && !jumlahValue) continue;
    
    if (!nilaiValue || !jumlahValue) {
      alert(`Tabel Utama - Baris ${i + 1}: Harap isi data dan frekuensi!`);
      hasError = true;
      break;
    }
    
    const nilai = parseFloat(nilaiValue);
    const jumlah = parseInt(jumlahValue);
    
    if (isNaN(nilai) || isNaN(jumlah) || jumlah < 1) {
      alert(`Tabel Utama - Baris ${i + 1}: Input tidak valid!`);
      hasError = true;
      break;
    }
    
    for (let j = 0; j < jumlah; j++) {
      data.push(nilai);
    }
  }
  
  if (hasError) return;
  
  // Ambil data dari tabel tambahan
  let additionalCount = 0;
  for (let i = 0; i < additionalRows.length; i++) {
    const nilaiInput = additionalRows[i].querySelector(".nilai-input");
    const jumlahInput = additionalRows[i].querySelector(".jumlah-input");
    
    const nilaiValue = nilaiInput.value.trim();
    const jumlahValue = jumlahInput.value.trim();
    
    if (!nilaiValue) continue; // Skip baris kosong
    
    const nilai = parseFloat(nilaiValue);
    const jumlah = jumlahValue ? parseInt(jumlahValue) : 1;
    
    if (isNaN(nilai) || isNaN(jumlah) || jumlah < 1) {
      alert(`Data Tambahan - Baris ${i + 1}: Input tidak valid!`);
      hasError = true;
      break;
    }
    
    for (let j = 0; j < jumlah; j++) {
      data.push(nilai);
    }
    additionalCount++;
  }
  
  if (hasError) return;
  
  if (additionalCount === 0) {
    alert("Harap isi minimal 1 nilai tambahan untuk eksplorasi!");
    return;
  }
  
  if (data.length === 0) {
    alert("Tidak ada data yang dimasukkan!");
    return;
  }
  
  // Reset output area
  document.getElementById("output").innerHTML = "";
  
  // Urutkan data
  let sorted = [...data].sort((a, b) => a - b);
  
  console.log("Data gabungan setelah diurutkan:", sorted);
  
  // Update variabel global
  currentData = sorted;
  
  // Update informasi jumlah data
  document.getElementById("dataCount").textContent = `Data saat ini: ${sorted.length} nilai (termasuk ${additionalCount} nilai tambahan)`;
  
  // Hitung statistik untuk data gabungan (untuk langkah perhitungan)
  let sum = sorted.reduce((a, b) => a + b, 0);
  let mean = sum / sorted.length;
  
  let median = (sorted.length % 2 === 1)
    ? sorted[Math.floor(sorted.length/2)]
    : (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2;
  
  let freq = {};
  sorted.forEach(v => freq[v] = (freq[v] || 0) + 1);
  let mode = Object.keys(freq).reduce((a,b) => freq[a] > freq[b] ? a : b);
  
  // Tampilkan langkah perhitungan untuk data gabungan jika checkbox dicentang
  if (document.getElementById("showSteps").checked) {
    tampilkanLangkahPerhitungan(sorted, mean, median, mode);
  }
  
  // JANGAN UPDATE GRAFIK PERTAMA - biarkan tetap menampilkan data asli
  // Grafik pertama sudah di-render saat prosesDataFromTable()
  
  // Tampilkan histogram kedua untuk perbandingan dengan data gabungan
  showAdditionalHistogram(sorted);
}

/**
 * Fungsi untuk menampilkan histogram tambahan di bawah histogram pertama
 */
function showAdditionalHistogram(data) {
  // Tampilkan section histogram tambahan
  document.getElementById("additionalHistogramSection").style.display = "block";
  
  // Buat histogram kedua
  createAdditionalHistogram(data);
  
  // Hitung statistik untuk data gabungan
  let sum = data.reduce((a, b) => a + b, 0);
  let mean = sum / data.length;
  
  let median = (data.length % 2 === 1)
    ? data[Math.floor(data.length/2)]
    : (data[data.length/2 - 1] + data[data.length/2]) / 2;
  
  let freq = {};
  data.forEach(v => freq[v] = (freq[v] || 0) + 1);
  let mode = Object.keys(freq).reduce((a,b) => freq[a] > freq[b] ? a : b);
  
  // Update nilai statistik tambahan
  document.getElementById("n-value-additional").textContent = data.length;
  document.getElementById("mean-value-additional").textContent = mean.toFixed(2);
  document.getElementById("median-value-additional").textContent = median;
  document.getElementById("mode-value-additional").textContent = mode;
}

/**
 * Fungsi untuk membuat histogram data tambahan
 */
function createAdditionalHistogram(data) {
  const ctx = document.getElementById("histogramAdditional");
  if (!ctx) return;
  
  // Hancurkan chart lama jika ada
  if (histogramAdditionalChart) {
    histogramAdditionalChart.destroy();
  }
  
  // Hitung frekuensi
  let freq = {};
  data.forEach(v => freq[v] = (freq[v] || 0) + 1);
  
  // Urutkan nilai untuk sumbu X
  let labels = Object.keys(freq).map(Number).sort((a, b) => a - b);
  let frequencies = labels.map(v => freq[v]);
  
  // Buat chart baru dengan warna orange
  histogramAdditionalChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Frekuensi',
        data: frequencies,
        backgroundColor: '#f57c00',
        borderColor: '#f57c00',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Nilai Data'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frekuensi'
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

/**
 * Fungsi utama untuk memproses data input dan menampilkan hasil statistik
 * Dijalankan saat user klik tombol "Terapkan Data" atau saat loadContohData() dipanggil
 */
function prosesData() {
  let input = document.getElementById("inputData").value;
  
  // Reset output area untuk menghapus langkah perhitungan sebelumnya
  document.getElementById("output").innerHTML = "";
  
  // Tampilkan pesan jika input kosong
  if (!input.trim()) {
    document.getElementById("output").innerHTML = "<b>Data kosong! Silakan masukkan data angka yang dipisahkan koma.</b>";
    clearStatistics();
    return;
  }
  
  // Deteksi input yang mungkin bermasalah
  let hasConsecutiveCommas = input.match(/,\s*,/);
  let hasLeadingOrTrailingCommas = input.match(/^,|,$/);
  
  // Perbaikan logika split: Hapus koma berlebih terlebih dahulu, lalu trim whitespace
  input = input.replace(/\s*,\s*/g, ',').replace(/,+/g, ',').replace(/^,|,$/g, '').trim();
  
  // Gunakan regex untuk memisahkan berdasarkan koma
  let rawItems = input.split(',');
  let filteredItems = rawItems.filter(item => item.trim() !== '');  // Filter string kosong
  let data = filteredItems.map(Number).filter(n => !isNaN(n));      // Filter nilai NaN

  // Validasi data dan berikan pesan yang informatif
  if (data.length === 0) {
    document.getElementById("output").innerHTML = "<b>Data tidak valid!</b> Pastikan data berisi angka yang dipisahkan koma.";
    clearStatistics();
    return;
  }
  
  // Variabel untuk menyimpan pesan peringatan
  let warningHTML = "";
  
  // Peringatan jika ada data yang difilter
  if (data.length < filteredItems.length) {
    warningHTML = "<div class='alert-warning'>Peringatan: Beberapa input bukan angka dan telah difilter.</div>";
  }
  
  // Peringatan jika ada koma berlebih yang mungkin menyebabkan kesalahan
  if (hasConsecutiveCommas || hasLeadingOrTrailingCommas) {
    warningHTML = "<div class='alert-warning'>Peringatan: Terdeteksi koma berlebih dalam input. Pastikan format data sudah benar.</div>";
  }
  
  // Update output dengan peringatan jika ada
  if (warningHTML) {
    document.getElementById("output").innerHTML = warningHTML;
  }
  
  // Update variabel global currentData
  currentData = data;

  // Update informasi jumlah data
  document.getElementById("dataCount").textContent = "Data saat ini: " + data.length + " nilai";

  // ===== PERHITUNGAN STATISTIK =====
  
  // Hitung mean (rata-rata)
  let sum = data.reduce((a, b) => a + b, 0);
  let mean = sum / data.length;

  // Hitung median (nilai tengah)
  let sorted = [...data].sort((a, b) => a - b); // Urutkan data
  let median = (data.length % 2 === 1)
    ? sorted[Math.floor(data.length/2)]  // Jika ganjil, ambil nilai tengah
    : (sorted[data.length/2 - 1] + sorted[data.length/2]) / 2; // Jika genap, ambil rata-rata dua nilai tengah

  // Hitung modus (nilai yang paling sering muncul)
  let freq = {};
  data.forEach(v => freq[v] = (freq[v] || 0) + 1); // Hitung frekuensi masing-masing nilai
  let mode = Object.keys(freq).reduce((a,b) => freq[a] > freq[b] ? a : b); // Temukan nilai dengan frekuensi tertinggi
  
  // Update statistik cards
  document.getElementById("n-value").textContent = data.length;
  document.getElementById("mean-value").textContent = mean.toFixed(2);
  document.getElementById("median-value").textContent = median;
  document.getElementById("mode-value").textContent = mode;
  
  // Update table
  let tableHtml = "<table><tr><th>No.</th><th>Data</th></tr>";
  for (let i = 0; i < sorted.length; i++) {
    tableHtml += "<tr><td>" + (i + 1) + "</td><td>" + sorted[i] + "</td></tr>";
  }
  tableHtml += "</table>";
  document.getElementById("tableOutput").innerHTML = tableHtml;
  
  // Update histogram
  createHistogram(data);

  // ===== LANGKAH PERHITUNGAN =====
  // Tampilkan langkah perhitungan jika checkbox dicentang
  if (document.getElementById("showSteps").checked) {
    // Ambil konten output saat ini (peringatan jika ada)
    let currentOutput = document.getElementById("output").innerHTML;
    let html = currentOutput;
    
    // Tambahkan bagian langkah perhitungan
    html += "<div class='langkah-section'>";
    html += "<h3>Langkah Perhitungan (Ringkasan)</h3>";
    
    // MEAN
    html += "<h4>Mean</h4>";
    html += "<p class='rumus-desc'>Jumlah semua nilai dibagi banyaknya data</p>";
    
    html += "<p><strong>Nilai:</strong> " + data.join(", ") + "</p>";
    
    // Rumus Mean dalam notasi matematika
    html += "<div class='formula'>";
    html += "<span class='formula-title'>Rumus Mean (μ):</span>";
    html += "μ = (x₁ + x₂ + ... + xₙ) / n";
    html += "<div class='formula-steps'>";
    html += "μ = (" + data.join(" + ") + ") / " + data.length;
    html += "<br>μ = " + sum.toFixed(2) + " / " + data.length;
    html += "<br>μ = " + mean.toFixed(2);
    html += "</div>";
    html += "</div>";
    
    html += "<p><strong>Jumlah (sum):</strong> " + sum.toFixed(2) + "</p>";
    html += "<p><strong>Mean:</strong> " + mean.toFixed(2) + "</p>";
    
    // MEDIAN
    html += "<h4>Median</h4>";
    html += "<p class='rumus-desc'>Data diurutkan, lalu ambil tengah (atau rata-rata dua tengah)</p>";
    
    html += "<p><strong>Data terurut:</strong> " + sorted.join(", ") + "</p>";
    
    // Rumus Median dalam notasi matematika
    html += "<div class='formula'>";
    html += "<span class='formula-title'>Rumus Median:</span>";
    
    if (data.length % 2 === 1) {
      // Rumus untuk jumlah data ganjil
      let midIndex = Math.floor(data.length/2);
      html += "Untuk jumlah data ganjil: Median = x<sub>(n+1)/2</sub>";
      html += "<div class='formula-steps'>";
      html += "Median = x<sub>(" + data.length + "+1)/2</sub> = x<sub>" + (midIndex + 1) + "</sub> = " + median;
      html += "</div>";
      html += "<p><strong>Median:</strong> " + median + " (nilai ke-" + (midIndex + 1) + " dari " + data.length + " data)</p>";
    } else {
      // Rumus untuk jumlah data genap
      let midIndex1 = data.length/2 - 1;
      let midIndex2 = data.length/2;
      html += "Untuk jumlah data genap: Median = (x<sub>n/2</sub> + x<sub>(n/2)+1</sub>) / 2";
      html += "<div class='formula-steps'>";
      html += "Median = (x<sub>" + (midIndex1 + 1) + "</sub> + x<sub>" + (midIndex2 + 1) + "</sub>) / 2";
      html += "<br>Median = (" + sorted[midIndex1] + " + " + sorted[midIndex2] + ") / 2";
      html += "<br>Median = " + median;
      html += "</div>";
      html += "<p><strong>Median:</strong> " + median + " (rata-rata dari nilai ke-" + (midIndex1 + 1) + 
              " (" + sorted[midIndex1] + ") dan ke-" + (midIndex2 + 1) + 
              " (" + sorted[midIndex2] + "))</p>";
    }
    html += "</div>";
    
    // MODUS
    html += "<h4>Modus</h4>";
    html += "<p class='rumus-desc'>Nilai yang paling sering muncul</p>";
    
    // Notasi matematika untuk modus
    html += "<div class='formula'>";
    html += "<span class='formula-title'>Definisi Modus:</span>";
    html += "Modus = nilai x dengan frekuensi tertinggi";
    
    // Hitung frekuensi untuk ditampilkan
    let frekuensiText = "";
    let frekuensiCalc = "";
    for (let key in freq) {
      frekuensiText += key + " (muncul " + freq[key] + " kali), ";
      frekuensiCalc += "f(" + key + ") = " + freq[key] + ", ";
    }
    frekuensiText = frekuensiText.slice(0, -2); // Hapus koma dan spasi terakhir
    frekuensiCalc = frekuensiCalc.slice(0, -2); // Hapus koma dan spasi terakhir
    
    html += "<div class='formula-steps'>";
    html += "Frekuensi tiap nilai:<br>" + frekuensiCalc;
    html += "<br>Nilai dengan frekuensi tertinggi: " + mode + " (muncul " + freq[mode] + " kali)";
    html += "</div>";
    html += "</div>";
    
    html += "<p><strong>Frekuensi:</strong> " + frekuensiText + "</p>";
    html += "<p><strong>Modus:</strong> " + mode + " (muncul " + freq[mode] + " kali)</p>";
    
    html += "</div>";
    
    // Update tampilan output
    document.getElementById("output").innerHTML = html;
  } else {
    // Jika langkah perhitungan tidak dicentang, kosongkan area output
    document.getElementById("output").innerHTML = "";
  }
}

/**
 * Fungsi untuk menampilkan langkah perhitungan data tunggal
 */
function tampilkanLangkahPerhitungan(data, mean, median, mode) {
  // Hitung ulang beberapa nilai yang dibutuhkan
  let sum = data.reduce((a, b) => a + b, 0);
  let sorted = [...data].sort((a, b) => a - b);
  
  // Hitung frekuensi untuk modus
  let freq = {};
  data.forEach(v => freq[v] = (freq[v] || 0) + 1);
  
  let html = "<div class='langkah-section'>";
  html += "<h3>Langkah Perhitungan (Ringkasan)</h3>";
  
  // MEAN
  html += "<h4>Mean</h4>";
  html += "<p class='rumus-desc'>Jumlah semua nilai dibagi banyaknya data</p>";
  
  html += "<p><strong>Nilai:</strong> " + data.join(", ") + "</p>";
  
  // Rumus Mean dalam notasi matematika
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Rumus Mean (μ):</span>";
  html += "μ = (x₁ + x₂ + ... + xₙ) / n";
  html += "<div class='formula-steps'>";
  html += "μ = (" + data.join(" + ") + ") / " + data.length;
  html += "<br>μ = " + sum.toFixed(2) + " / " + data.length;
  html += "<br>μ = " + mean.toFixed(2);
  html += "</div>";
  html += "</div>";
  
  html += "<p><strong>Jumlah (sum):</strong> " + sum.toFixed(2) + "</p>";
  html += "<p><strong>Mean:</strong> " + mean.toFixed(2) + "</p>";
  
  // MEDIAN
  html += "<h4>Median</h4>";
  html += "<p class='rumus-desc'>Data diurutkan, lalu ambil tengah (atau rata-rata dua tengah)</p>";
  
  html += "<p><strong>Data terurut:</strong> " + sorted.join(", ") + "</p>";
  
  // Rumus Median dalam notasi matematika
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Rumus Median:</span>";
  
  if (data.length % 2 === 1) {
    // Rumus untuk jumlah data ganjil
    let midIndex = Math.floor(data.length/2);
    html += "Untuk jumlah data ganjil: Median = x<sub>(n+1)/2</sub>";
    html += "<div class='formula-steps'>";
    html += "Median = x<sub>(" + data.length + "+1)/2</sub> = x<sub>" + (midIndex + 1) + "</sub> = " + median;
    html += "</div>";
    html += "<p><strong>Median:</strong> " + median + " (nilai ke-" + (midIndex + 1) + " dari " + data.length + " data)</p>";
  } else {
    // Rumus untuk jumlah data genap
    let midIndex1 = data.length/2 - 1;
    let midIndex2 = data.length/2;
    html += "Untuk jumlah data genap: Median = (x<sub>n/2</sub> + x<sub>(n/2)+1</sub>) / 2";
    html += "<div class='formula-steps'>";
    html += "Median = (x<sub>" + (midIndex1 + 1) + "</sub> + x<sub>" + (midIndex2 + 1) + "</sub>) / 2";
    html += "<br>Median = (" + sorted[midIndex1] + " + " + sorted[midIndex2] + ") / 2";
    html += "<br>Median = " + median;
    html += "</div>";
    html += "<p><strong>Median:</strong> " + median + " (rata-rata dari nilai ke-" + (midIndex1 + 1) + 
            " (" + sorted[midIndex1] + ") dan ke-" + (midIndex2 + 1) + 
            " (" + sorted[midIndex2] + "))</p>";
  }
  html += "</div>";
  
  // MODUS
  html += "<h4>Modus</h4>";
  html += "<p class='rumus-desc'>Nilai yang paling sering muncul</p>";
  
  // Notasi matematika untuk modus
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Definisi Modus:</span>";
  html += "Modus = nilai x dengan frekuensi tertinggi";
  
  // Hitung frekuensi untuk ditampilkan
  let frekuensiText = "";
  let frekuensiCalc = "";
  for (let key in freq) {
    frekuensiText += key + " (muncul " + freq[key] + " kali), ";
    frekuensiCalc += "f(" + key + ") = " + freq[key] + ", ";
  }
  frekuensiText = frekuensiText.slice(0, -2); // Hapus koma dan spasi terakhir
  frekuensiCalc = frekuensiCalc.slice(0, -2); // Hapus koma dan spasi terakhir
  
  html += "<div class='formula-steps'>";
  html += "Frekuensi tiap nilai:<br>" + frekuensiCalc;
  html += "<br>Nilai dengan frekuensi tertinggi: " + mode + " (muncul " + freq[mode] + " kali)";
  html += "</div>";
  html += "</div>";
  
  html += "<p><strong>Frekuensi:</strong> " + frekuensiText + "</p>";
  html += "<p><strong>Modus:</strong> " + mode + " (muncul " + freq[mode] + " kali)</p>";
  
  html += "</div>";
  
  // Update tampilan output
  document.getElementById("output").innerHTML = html;
}

/**
 * Fungsi untuk menampilkan atau menyembunyikan langkah perhitungan saat checkbox berubah (untuk data kelompok)
 */
function toggleLangkahPerhitunganKelompok() {
  const showSteps = document.getElementById("showStepsKelompok").checked;
  const output = document.getElementById("outputKelompok");
  
  if (showSteps) {
    // Jika checkbox dicentang, jalankan prosesDataKelompok untuk menampilkan langkah perhitungan
    prosesDataKelompok();
  } else {
    // Jika checkbox tidak dicentang, kosongkan area output
    output.innerHTML = "";
  }
}

/**
 * Fungsi untuk memuat dataset contoh untuk data kelompok
 */
function loadContohDataKelompok() {
  // Dataset contoh yang bisa dipilih secara acak
  let datasets = [
    [
      ["1-10", 5],
      ["11-20", 8],
      ["21-30", 12]
    ],
    [
      ["50-59", 10],
      ["60-69", 15],
      ["70-79", 20],
      ["80-89", 5]
    ],
    [
      ["0-9", 3],
      ["10-19", 7],
      ["20-29", 12],
      ["30-39", 8],
      ["40-49", 4]
    ],
    [
      ["100-109", 8],
      ["110-119", 15],
      ["120-129", 10],
      ["130-139", 5]
    ]
  ];
  
  // Memilih dataset secara acak
  let randomIndex = Math.floor(Math.random() * datasets.length);
  let selectedDataset = datasets[randomIndex];
  
  // Kosongkan tabel terlebih dahulu
  const tbody = document.getElementById("dataKelompokTableBody");
  tbody.innerHTML = "";
  
  // Isi tabel dengan data contoh
  selectedDataset.forEach(([interval, frekuensi]) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td><input type="text" class="interval-input" value="${interval}" /></td>
      <td><input type="number" class="frekuensi-input" value="${frekuensi}" min="1" /></td>
      <td><button class="delete-row-btn" onclick="deleteRowKelompok(this)">🗑️</button></td>
    `;
    tbody.appendChild(newRow);
  });
  
  // Proses dataset yang dipilih
  prosesDataKelompokFromTable();
}

/**
 * Fungsi untuk membersihkan semua data kelompok dan menghapus tampilan statistik
 */
function clearDataKelompok() {
  // Kosongkan tabel - reset ke 1 baris kosong
  const tbody = document.getElementById("dataKelompokTableBody");
  tbody.innerHTML = `
    <tr>
      <td><input type="text" class="interval-input" placeholder="1-10" /></td>
      <td><input type="number" class="frekuensi-input" placeholder="5" min="1" /></td>
      <td><button class="delete-row-btn" onclick="deleteRowKelompok(this)">🗑️</button></td>
    </tr>
  `;
  
  // Kosongkan area output dan tabel
  document.getElementById("outputKelompok").innerHTML = "";
  document.getElementById("tableOutputKelompok").innerHTML = "";
  
  // Reset informasi jumlah data
  document.getElementById("dataCountKelompok").textContent = "Data saat ini: 0 kelompok, 0 nilai";
  
  // Reset nilai statistik di kartu
  document.getElementById("n-value-kelompok").textContent = "0";
  document.getElementById("mean-value-kelompok").textContent = "0.00";
  document.getElementById("median-value-kelompok").textContent = "0";
  document.getElementById("mode-value-kelompok").textContent = "-";
  
  // Sembunyikan section nilai tambahan
  document.getElementById("additionalDataSectionKelompok").style.display = "none";
  
  // Reset tabel nilai tambahan
  const additionalTbody = document.getElementById("additionalDataTableBodyKelompok");
  additionalTbody.innerHTML = `
    <tr>
      <td><input type="text" class="interval-input" placeholder="31-40" /></td>
      <td><input type="number" class="frekuensi-input" placeholder="3" min="1" /></td>
    </tr>
    <tr>
      <td><input type="text" class="interval-input" placeholder="41-50" /></td>
      <td><input type="number" class="frekuensi-input" placeholder="4" min="1" /></td>
    </tr>
    <tr>
      <td><input type="text" class="interval-input" placeholder="51-60" /></td>
      <td><input type="number" class="frekuensi-input" placeholder="2" min="1" /></td>
    </tr>
    <tr>
      <td><input type="text" class="interval-input" placeholder="61-70" /></td>
      <td><input type="number" class="frekuensi-input" placeholder="5" min="1" /></td>
    </tr>
    <tr>
      <td><input type="text" class="interval-input" placeholder="71-80" /></td>
      <td><input type="number" class="frekuensi-input" placeholder="3" min="1" /></td>
    </tr>
  `;
  
  // Hapus chart jika ada
  if (histogramChartKelompok) {
    histogramChartKelompok.destroy();
  }
  
  // Reset data original
  originalDataKelompok = {
    intervals: [],
    n: 0,
    mean: 0,
    median: 0,
    mode: '-'
  };
}

/**
 * Fungsi untuk membuat histogram dari data kelompok
 * @param {Array} dataKelompok - Array berisi data kelompok dalam format [[batas_bawah, batas_atas, frekuensi], ...]
 */
function createHistogramKelompok(dataKelompok) {
  // Hapus chart yang sudah ada jika ada
  if (histogramChartKelompok) {
    histogramChartKelompok.destroy();
  }
  
  // Jika tidak ada data yang valid, keluar dari fungsi
  if (dataKelompok.length === 0) {
    return;
  }
  
  // Buat label dan data untuk chart
  let labels = dataKelompok.map(group => `${group[0]}-${group[1]}`);
  let chartData = dataKelompok.map(group => group[2]);
  
  // Buat chart dengan Chart.js
  let ctx = document.getElementById('histogramChartKelompok').getContext('2d');
  histogramChartKelompok = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Frekuensi',
        data: chartData,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frekuensi'
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          title: {
            display: true,
            text: 'Interval'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      }
    }
  });
}

/**
 * Fungsi untuk menginisialisasi chart untuk data kelompok
 * @param {Array} dataKelompok - Array data kelompok yang akan digunakan
 */
function initChartKelompok(dataKelompok) {
  createHistogramKelompok(dataKelompok);
}

// ===== FUNGSI UNTUK TABEL INPUT DATA KELOMPOK =====

/**
 * Fungsi untuk menambah baris baru pada tabel input data kelompok
 */
function addRowKelompok() {
  const tbody = document.getElementById("dataKelompokTableBody");
  const newRow = document.createElement("tr");
  
  newRow.innerHTML = `
    <td><input type="text" class="interval-input" placeholder="31-40" /></td>
    <td><input type="number" class="frekuensi-input" placeholder="5" min="1" /></td>
    <td><button class="delete-row-btn" onclick="deleteRowKelompok(this)">🗑️</button></td>
  `;
  
  tbody.appendChild(newRow);
}

/**
 * Fungsi untuk menghapus baris dari tabel input data kelompok
 */
function deleteRowKelompok(button) {
  const tbody = document.getElementById("dataKelompokTableBody");
  const rows = tbody.getElementsByTagName("tr");
  
  // Jangan izinkan menghapus jika hanya tersisa 1 baris
  if (rows.length <= 1) {
    alert("Minimal harus ada 1 baris data!");
    return;
  }
  
  const row = button.parentNode.parentNode;
  row.remove();
}

/**
 * Fungsi untuk memproses data dari tabel input
 */
function prosesDataKelompokFromTable() {
  const tbody = document.getElementById("dataKelompokTableBody");
  const rows = tbody.getElementsByTagName("tr");
  
  // Reset output area
  document.getElementById("outputKelompok").innerHTML = "";
  
  let dataKelompok = [];
  let totalNilai = 0;
  let hasError = false;
  
  // Ambil data dari setiap baris tabel
  for (let i = 0; i < rows.length; i++) {
    const intervalInput = rows[i].querySelector(".interval-input");
    const frekuensiInput = rows[i].querySelector(".frekuensi-input");
    
    const intervalValue = intervalInput.value.trim();
    const frekuensiValue = frekuensiInput.value.trim();
    
    // Skip baris kosong
    if (!intervalValue && !frekuensiValue) continue;
    
    // Validasi input
    if (!intervalValue || !frekuensiValue) {
      alert(`Baris ${i + 1}: Harap isi interval dan frekuensi!`);
      hasError = true;
      break;
    }
    
    // Parse interval
    const intervalParts = intervalValue.split('-');
    if (intervalParts.length !== 2) {
      alert(`Baris ${i + 1}: Format interval tidak valid! Gunakan format: 1-10`);
      hasError = true;
      break;
    }
    
    const batasBawah = parseInt(intervalParts[0].trim());
    const batasAtas = parseInt(intervalParts[1].trim());
    const frekuensi = parseInt(frekuensiValue);
    
    if (isNaN(batasBawah) || isNaN(batasAtas) || isNaN(frekuensi)) {
      alert(`Baris ${i + 1}: Nilai harus berupa angka!`);
      hasError = true;
      break;
    }
    
    if (frekuensi < 1) {
      alert(`Baris ${i + 1}: Frekuensi harus minimal 1!`);
      hasError = true;
      break;
    }
    
    dataKelompok.push([batasBawah, batasAtas, frekuensi]);
    totalNilai += frekuensi;
  }
  
  if (hasError) {
    clearDataKelompok();
    return;
  }
  
  if (dataKelompok.length === 0) {
    alert("Tidak ada data yang dimasukkan!");
    clearDataKelompok();
    return;
  }
  
  // Urutkan dataKelompok berdasarkan batas bawah
  dataKelompok.sort((a, b) => a[0] - b[0]);
  
  // Update variabel global
  currentDataKelompok = dataKelompok;
  
  // Update informasi jumlah data
  document.getElementById("dataCountKelompok").textContent = `Data saat ini: ${dataKelompok.length} kelompok, ${totalNilai} nilai`;
  
  // Hitung statistik untuk data kelompok
  let stats = hitungStatistikKelompok(dataKelompok);
  
  // Update statistik cards
  document.getElementById("n-value-kelompok").textContent = stats.n;
  document.getElementById("mean-value-kelompok").textContent = stats.mean.toFixed(2);
  document.getElementById("median-value-kelompok").textContent = stats.median;
  document.getElementById("mode-value-kelompok").textContent = stats.mode;
  
  // Update table
  let tableHtml = "<table><tr><th>Interval</th><th>Frekuensi</th><th>Nilai Tengah</th><th>f×x</th></tr>";
  for (let i = 0; i < dataKelompok.length; i++) {
    let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
    let frekuensi = dataKelompok[i][2];
    let nilaiTengah = (dataKelompok[i][0] + dataKelompok[i][1]) / 2;
    let fx = frekuensi * nilaiTengah;
    
    tableHtml += `<tr><td>${interval}</td><td>${frekuensi}</td><td>${nilaiTengah}</td><td>${fx}</td></tr>`;
  }
  tableHtml += "</table>";
  document.getElementById("tableOutputKelompok").innerHTML = tableHtml;
  
  // Tampilkan langkah perhitungan jika checkbox dicentang
  if (document.getElementById("showStepsKelompok").checked) {
    tampilkanLangkahPerhitunganKelompok(dataKelompok, stats);
  }
  
  // Buat histogram untuk data kelompok
  createHistogramKelompok(dataKelompok);
  
  // Simpan data original untuk perbandingan
  originalDataKelompok = {
    intervals: dataKelompok,
    n: stats.n,
    mean: stats.mean,
    median: stats.median,
    mode: stats.mode
  };
  
  // Tampilkan section untuk input 5 kelompok tambahan
  document.getElementById("additionalDataSectionKelompok").style.display = "block";
  
  // Sembunyikan kartu perbandingan
  document.getElementById("comparisonCardKelompok").style.display = "none";
}

/**
 * Fungsi untuk memproses data kelompok dengan menambahkan 5 kelompok tambahan
 */
function prosesDataKelompokWithAdditional() {
  console.log("prosesDataKelompokWithAdditional dipanggil");
  
  // Ambil data dari tabel utama
  const mainTbody = document.getElementById("dataKelompokTableBody");
  const mainRows = mainTbody.getElementsByTagName("tr");
  
  // Ambil data dari tabel tambahan
  const additionalTbody = document.getElementById("additionalDataTableBodyKelompok");
  const additionalRows = additionalTbody.getElementsByTagName("tr");
  
  let dataKelompok = [];
  let hasError = false;
  
  // Ambil data dari tabel utama
  for (let i = 0; i < mainRows.length; i++) {
    const intervalInput = mainRows[i].querySelector(".interval-input");
    const frekuensiInput = mainRows[i].querySelector(".frekuensi-input");
    
    const intervalValue = intervalInput.value.trim();
    const frekuensiValue = frekuensiInput.value.trim();
    
    if (!intervalValue && !frekuensiValue) continue;
    
    if (!intervalValue || !frekuensiValue) {
      alert(`Tabel Utama - Baris ${i + 1}: Harap isi interval dan frekuensi!`);
      hasError = true;
      break;
    }
    
    const intervalParts = intervalValue.split('-');
    if (intervalParts.length !== 2) {
      alert(`Tabel Utama - Baris ${i + 1}: Format interval tidak valid!`);
      hasError = true;
      break;
    }
    
    const batasBawah = parseInt(intervalParts[0].trim());
    const batasAtas = parseInt(intervalParts[1].trim());
    const frekuensi = parseInt(frekuensiValue);
    
    if (isNaN(batasBawah) || isNaN(batasAtas) || isNaN(frekuensi) || frekuensi < 1) {
      alert(`Tabel Utama - Baris ${i + 1}: Input tidak valid!`);
      hasError = true;
      break;
    }
    
    dataKelompok.push([batasBawah, batasAtas, frekuensi]);
  }
  
  if (hasError) return;
  
  // Ambil data dari tabel tambahan
  let additionalCount = 0;
  for (let i = 0; i < additionalRows.length; i++) {
    const intervalInput = additionalRows[i].querySelector(".interval-input");
    const frekuensiInput = additionalRows[i].querySelector(".frekuensi-input");
    
    const intervalValue = intervalInput.value.trim();
    const frekuensiValue = frekuensiInput.value.trim();
    
    if (!intervalValue) continue; // Skip baris kosong
    
    const intervalParts = intervalValue.split('-');
    if (intervalParts.length !== 2) {
      alert(`Data Tambahan - Baris ${i + 1}: Format interval tidak valid!`);
      hasError = true;
      break;
    }
    
    const batasBawah = parseInt(intervalParts[0].trim());
    const batasAtas = parseInt(intervalParts[1].trim());
    const frekuensi = frekuensiValue ? parseInt(frekuensiValue) : 1;
    
    if (isNaN(batasBawah) || isNaN(batasAtas) || isNaN(frekuensi) || frekuensi < 1) {
      alert(`Data Tambahan - Baris ${i + 1}: Input tidak valid!`);
      hasError = true;
      break;
    }
    
    // Cek apakah interval yang sama sudah ada, jika ya gabungkan frekuensinya
    let found = false;
    for (let j = 0; j < dataKelompok.length; j++) {
      if (dataKelompok[j][0] === batasBawah && dataKelompok[j][1] === batasAtas) {
        dataKelompok[j][2] += frekuensi; // Gabungkan frekuensi
        found = true;
        break;
      }
    }
    
    // Jika interval belum ada, tambahkan sebagai interval baru
    if (!found) {
      dataKelompok.push([batasBawah, batasAtas, frekuensi]);
    }
    
    additionalCount++;
  }
  
  if (hasError) return;
  
  if (additionalCount === 0) {
    alert("Harap isi minimal 1 kelompok tambahan untuk eksplorasi!");
    return;
  }
  
  if (dataKelompok.length === 0) {
    alert("Tidak ada data yang dimasukkan!");
    return;
  }
  
  // Reset output area
  document.getElementById("outputKelompok").innerHTML = "";
  
  // Urutkan dataKelompok berdasarkan batas bawah
  dataKelompok.sort((a, b) => a[0] - b[0]);
  
  console.log("Data kelompok gabungan setelah diurutkan:", dataKelompok);
  
  // Update variabel global
  currentDataKelompok = dataKelompok;
  
  // Hitung total nilai
  let totalNilai = dataKelompok.reduce((sum, item) => sum + item[2], 0);
  
  // Update informasi jumlah data
  document.getElementById("dataCountKelompok").textContent = `Data saat ini: ${dataKelompok.length} kelompok (termasuk ${additionalCount} kelompok tambahan), ${totalNilai} nilai`;
  
  // Hitung statistik untuk data kelompok gabungan (untuk langkah perhitungan)
  let stats = hitungStatistikKelompok(dataKelompok);
  
  // JANGAN UPDATE STATISTIK CARDS UTAMA - biarkan menampilkan data asli
  
  // Update table untuk data gabungan
  let tableHtml = "<table><tr><th>Interval</th><th>Frekuensi</th><th>Nilai Tengah</th><th>f×x</th></tr>";
  for (let i = 0; i < dataKelompok.length; i++) {
    let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
    let frekuensi = dataKelompok[i][2];
    let nilaiTengah = (dataKelompok[i][0] + dataKelompok[i][1]) / 2;
    let fx = frekuensi * nilaiTengah;
    
    tableHtml += `<tr><td>${interval}</td><td>${frekuensi}</td><td>${nilaiTengah}</td><td>${fx}</td></tr>`;
  }
  tableHtml += "</table>";
  document.getElementById("tableOutputKelompok").innerHTML = tableHtml;
  
  // Tampilkan langkah perhitungan untuk data gabungan jika checkbox dicentang
  if (document.getElementById("showStepsKelompok").checked) {
    tampilkanLangkahPerhitunganKelompok(dataKelompok, stats);
  }
  
  // JANGAN UPDATE GRAFIK PERTAMA - biarkan tetap menampilkan data asli
  // Grafik pertama sudah di-render saat prosesDataKelompokFromTable()
  
  // Tampilkan histogram kedua untuk perbandingan dengan data gabungan
  showAdditionalHistogramKelompok(dataKelompok);
}

/**
 * Fungsi untuk menampilkan histogram tambahan kelompok di bawah histogram pertama
 */
function showAdditionalHistogramKelompok(dataKelompok) {
  // Tampilkan section histogram tambahan
  document.getElementById("additionalHistogramSectionKelompok").style.display = "block";
  
  // Buat histogram kedua
  createAdditionalHistogramKelompok(dataKelompok);
  
  // Hitung statistik untuk data kelompok gabungan
  const stats = hitungStatistikKelompok(dataKelompok);
  
  // Update nilai statistik tambahan kelompok
  document.getElementById("n-value-kelompok-additional").textContent = stats.n;
  document.getElementById("mean-value-kelompok-additional").textContent = stats.mean.toFixed(2);
  document.getElementById("median-value-kelompok-additional").textContent = stats.median;
  document.getElementById("mode-value-kelompok-additional").textContent = stats.mode;
}

/**
 * Fungsi untuk membuat histogram data kelompok tambahan
 */
function createAdditionalHistogramKelompok(dataKelompok) {
  const ctx = document.getElementById("histogramKelompokAdditional");
  if (!ctx) return;
  
  // Hancurkan chart lama jika ada
  if (histogramKelompokAdditionalChart) {
    histogramKelompokAdditionalChart.destroy();
  }
  
  // Siapkan data untuk chart
  let labels = [];
  let frequencies = [];
  
  for (let i = 0; i < dataKelompok.length; i++) {
    let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
    labels.push(interval);
    frequencies.push(dataKelompok[i][2]);
  }
  
  // Buat chart baru dengan warna orange
  histogramKelompokAdditionalChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Frekuensi',
        data: frequencies,
        backgroundColor: '#f57c00',
        borderColor: '#f57c00',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Interval Kelas'
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Frekuensi'
          },
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

/**
 * Fungsi utama untuk memproses data kelompok dan menampilkan hasil statistik
 */
function prosesDataKelompok() {
  let input = document.getElementById("inputDataKelompok").value;
  
  // Reset output area untuk menghapus langkah perhitungan sebelumnya
  document.getElementById("outputKelompok").innerHTML = "";
  
  // Tampilkan pesan jika input kosong
  if (!input.trim()) {
    document.getElementById("outputKelompok").innerHTML = "<b>Data kosong! Silakan masukkan data kelompok dengan format: interval bawah-interval atas:frekuensi.</b>";
    clearDataKelompok();
    return;
  }
  
  // Proses input data kelompok
  try {
    // Split input berdasarkan koma dan bersihkan whitespace
    let kelompokItems = input.split(',').map(item => item.trim());
    let dataKelompok = [];
    let totalNilai = 0;
    let lebarKelas = 0;
    
    // Parse setiap kelompok data
    kelompokItems.forEach((item, index) => {
      // Format yang diharapkan: "10-20:5" (interval:frekuensi)
      let parts = item.split(':');
      if (parts.length !== 2) throw new Error("Format data kelompok tidak valid");
      
      let interval = parts[0].trim().split('-');
      if (interval.length !== 2) throw new Error("Format interval tidak valid");
      
      let batasBawah = parseInt(interval[0].trim());
      let batasAtas = parseInt(interval[1].trim());
      let frekuensi = parseInt(parts[1].trim());
      
      if (isNaN(batasBawah) || isNaN(batasAtas) || isNaN(frekuensi)) {
        throw new Error("Nilai interval atau frekuensi tidak valid");
      }
      
      // Cek lebar kelas untuk konsistensi
      let currentWidth = batasAtas - batasBawah + 1; // +1 karena interval inklusif
      if (index === 0) {
        lebarKelas = currentWidth;
      } else if (currentWidth !== lebarKelas) {
        throw new Error(`Lebar kelas tidak konsisten. Semua kelas harus memiliki lebar yang sama (${lebarKelas})`);
      }
      
      dataKelompok.push([batasBawah, batasAtas, frekuensi]);
      totalNilai += frekuensi;
    });
    
    // Urutkan dataKelompok berdasarkan batas bawah
    dataKelompok.sort((a, b) => a[0] - b[0]);
    
    // Update variabel global
    currentDataKelompok = dataKelompok;
    
    // Update informasi jumlah data
    document.getElementById("dataCountKelompok").textContent = `Data saat ini: ${dataKelompok.length} kelompok, ${totalNilai} nilai`;
    
    // Hitung statistik untuk data kelompok
    let stats = hitungStatistikKelompok(dataKelompok);
    
    // Update statistik cards
    document.getElementById("n-value-kelompok").textContent = stats.n;
    document.getElementById("mean-value-kelompok").textContent = stats.mean.toFixed(2);
    document.getElementById("median-value-kelompok").textContent = stats.median;
    document.getElementById("mode-value-kelompok").textContent = stats.mode;
    
    // Update table
    let tableHtml = "<table><tr><th>Interval</th><th>Frekuensi</th><th>Nilai Tengah</th><th>f×x</th></tr>";
    for (let i = 0; i < dataKelompok.length; i++) {
      let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
      let frekuensi = dataKelompok[i][2];
      let nilaiTengah = (dataKelompok[i][0] + dataKelompok[i][1]) / 2;
      let fx = frekuensi * nilaiTengah;
      
      tableHtml += `<tr><td>${interval}</td><td>${frekuensi}</td><td>${nilaiTengah}</td><td>${fx}</td></tr>`;
    }
    tableHtml += "</table>";
    document.getElementById("tableOutputKelompok").innerHTML = tableHtml;
    
    // Update histogram
    createHistogramKelompok(dataKelompok);
    
    // Tampilkan langkah perhitungan jika checkbox dicentang
    if (document.getElementById("showStepsKelompok").checked) {
      tampilkanLangkahPerhitunganKelompok(dataKelompok, stats);
    }
    
  } catch (error) {
    document.getElementById("outputKelompok").innerHTML = `<b>Error: ${error.message}</b><br>Pastikan format data: "batas bawah-batas atas:frekuensi" dan dipisahkan koma.`;
    clearDataKelompok();
  }
}

/**
 * Fungsi untuk menghitung statistik dari data kelompok
 * @param {Array} dataKelompok - Array data kelompok dalam format [[batas_bawah, batas_atas, frekuensi], ...]
 * @returns {Object} Object berisi nilai n, mean, median, dan mode
 */
function hitungStatistikKelompok(dataKelompok) {
  // Ekstrak nilai tengah dan frekuensi dari setiap kelompok
  let nilaiTengah = dataKelompok.map(group => (group[0] + group[1]) / 2);
  let frekuensi = dataKelompok.map(group => group[2]);
  
  // Hitung n (total nilai)
  let n = frekuensi.reduce((sum, f) => sum + f, 0);
  
  // Hitung mean
  let fx = nilaiTengah.map((x, i) => x * frekuensi[i]);
  let sumFx = fx.reduce((sum, val) => sum + val, 0);
  let mean = sumFx / n;
  
  // Hitung median
  let medianPosition = n / 2;
  let cumulativeFreq = 0;
  let medianGroupIndex = 0;
  let cumulativeFreqArray = [0]; // Mulai dengan 0 untuk mempermudah akses
  
  for (let i = 0; i < dataKelompok.length; i++) {
    cumulativeFreq += frekuensi[i];
    cumulativeFreqArray.push(cumulativeFreq);
    
    if (cumulativeFreq >= medianPosition && medianGroupIndex === 0) {
      medianGroupIndex = i;
    }
  }
  
  let medianGroup = dataKelompok[medianGroupIndex];
  let lowerBound = medianGroup[0];
  // Cek kesamaan lebar kelas
  let width = medianGroup[1] - medianGroup[0] + 1; // Tambahkan 1 karena interval inklusif
  let prevCumulativeFreq = cumulativeFreqArray[medianGroupIndex];
  let medianFreq = frekuensi[medianGroupIndex];
  
  let median = lowerBound + ((n/2 - prevCumulativeFreq) / medianFreq) * width;
  median = Math.round(median);
  
  // Hitung modus (kelompok dengan frekuensi tertinggi)
  let maxFreq = Math.max(...frekuensi);
  let modeGroupIndex = frekuensi.indexOf(maxFreq);
  let modeGroup = dataKelompok[modeGroupIndex];
  
  let mode = (modeGroup[0] + modeGroup[1]) / 2;
  mode = Math.round(mode);
  
  return {
    n: n,
    mean: mean,
    median: median,
    mode: mode
  };
}

/**
 * Fungsi untuk menampilkan langkah perhitungan statistik data kelompok
 * @param {Array} dataKelompok - Array data kelompok dalam format [[batas_bawah, batas_atas, frekuensi], ...]
 * @param {Object} stats - Object berisi hasil perhitungan statistik
 */
function tampilkanLangkahPerhitunganKelompok(dataKelompok, stats) {
  let html = "<div class='langkah-section'>";
  html += "<h3>Langkah Perhitungan Data Kelompok (Ringkasan)</h3>";
  
  // Siapkan data untuk perhitungan
  let nilaiTengah = dataKelompok.map(group => (group[0] + group[1]) / 2);
  let frekuensi = dataKelompok.map(group => group[2]);
  let fx = nilaiTengah.map((x, i) => x * frekuensi[i]);
  let sumFx = fx.reduce((sum, val) => sum + val, 0);
  let n = frekuensi.reduce((sum, f) => sum + f, 0);
  
  // MEAN
  html += "<h4>Mean</h4>";
  html += "<p class='rumus-desc'>Jumlah (frekuensi × nilai tengah) dibagi total frekuensi</p>";
  
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Rumus Mean untuk Data Kelompok:</span>";
  html += "μ = Σ(f × x) / n";
  
  html += "<div class='formula-steps'>";
  html += "μ = (";
  
  for (let i = 0; i < dataKelompok.length; i++) {
    if (i > 0) html += " + ";
    html += `${frekuensi[i]} × ${nilaiTengah[i].toFixed(1)}`;
  }
  
  html += ") / " + n;
  html += `<br>μ = ${sumFx.toFixed(2)} / ${n}`;
  html += `<br>μ = ${stats.mean.toFixed(2)}`;
  html += "</div></div>";
  
  // Tabel perhitungan
  html += "<table>";
  html += "<tr><th>Interval</th><th>Frek (f)</th><th>Nilai Tengah (x)</th><th>f×x</th></tr>";
  
  let totalF = 0;
  let totalFx = 0;
  
  for (let i = 0; i < dataKelompok.length; i++) {
    let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
    let f = frekuensi[i];
    let x = nilaiTengah[i];
    let fxi = fx[i];
    
    html += `<tr><td>${interval}</td><td>${f}</td><td>${x.toFixed(1)}</td><td>${fxi.toFixed(2)}</td></tr>`;
    
    totalF += f;
    totalFx += fxi;
  }
  
  html += `<tr><td colspan="2">Total</td><td>Σf = ${totalF}</td><td>Σ(f×x) = ${totalFx.toFixed(2)}</td></tr>`;
  html += "</table>";
  
  html += `<p><strong>Mean:</strong> Σ(f×x) / Σf = ${totalFx.toFixed(2)} / ${totalF} = ${stats.mean.toFixed(2)}</p>`;
  
  // MEDIAN
  html += "<h4>Median</h4>";
  html += "<p class='rumus-desc'>Nilai tengah dari data kelompok</p>";
  
  // Tentukan kelompok yang berisi median
  let cumulativeFreq = 0;
  let medianGroupIndex = 0;
  let cumulativeFreqArray = [0]; // Mulai dengan 0 untuk mempermudah akses
  
  for (let i = 0; i < dataKelompok.length; i++) {
    cumulativeFreq += frekuensi[i];
    cumulativeFreqArray.push(cumulativeFreq);
    
    if (cumulativeFreq >= n/2 && medianGroupIndex === 0) {
      medianGroupIndex = i;
    }
  }
  
  let medianGroup = dataKelompok[medianGroupIndex];
  let lowerBound = medianGroup[0];
  let width = medianGroup[1] - medianGroup[0] + 1; // Tambahkan 1 karena interval inklusif
  let prevCumulativeFreq = cumulativeFreqArray[medianGroupIndex];
  let medianFreq = frekuensi[medianGroupIndex];
  
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Rumus Median untuk Data Kelompok:</span>";
  html += "Me = L + ((n/2 - CF) / f) × w";
  html += "<p>Dimana: L = batas bawah kelas median, CF = frekuensi kumulatif sebelum kelas median, f = frekuensi kelas median, w = lebar kelas</p>";
  
  html += "<div class='formula-steps'>";
  html += `Me = ${lowerBound} + ((${n}/2 - ${prevCumulativeFreq}) / ${medianFreq}) × ${width}`;
  html += `<br>Me = ${lowerBound} + ((${n/2} - ${prevCumulativeFreq}) / ${medianFreq}) × ${width}`;
  let calculation = lowerBound + ((n/2 - prevCumulativeFreq) / medianFreq) * width;
  html += `<br>Me = ${calculation.toFixed(2)} ≈ ${stats.median}`;
  html += "</div></div>";
  
  // Tabel frekuensi kumulatif
  html += "<table>";
  html += "<tr><th>Interval</th><th>Frekuensi (f)</th><th>Frekuensi Kumulatif (CF)</th></tr>";
  
  let runningSum = 0;
  for (let i = 0; i < dataKelompok.length; i++) {
    let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
    let f = frekuensi[i];
    runningSum += f;
    let cfText = runningSum;
    if (i === medianGroupIndex) {
      cfText = `<strong>${cfText}</strong>`;
      interval = `<strong>${interval}</strong> (kelas median)`;
    }
    html += `<tr><td>${interval}</td><td>${f}</td><td>${cfText}</td></tr>`;
  }
  html += "</table>";
  
  html += `<p><strong>Median:</strong> ${stats.median}</p>`;
  
  // MODUS
  html += "<h4>Modus</h4>";
  html += "<p class='rumus-desc'>Nilai tengah dari kelompok dengan frekuensi tertinggi</p>";
  
  let maxFreq = Math.max(...frekuensi);
  let modeGroupIndex = frekuensi.indexOf(maxFreq);
  let modeGroup = dataKelompok[modeGroupIndex];
  let modeLowerBound = modeGroup[0];
  let modeUpperBound = modeGroup[1];
  
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Rumus Modus untuk Data Kelompok:</span>";
  html += "Mo = nilai tengah kelas dengan frekuensi tertinggi";
  html += "<div class='formula-steps'>";
  html += `Mo = (${modeLowerBound} + ${modeUpperBound}) / 2`;
  html += `<br>Mo = ${(modeLowerBound + modeUpperBound) / 2} ≈ ${stats.mode}`;
  html += "</div></div>";
  
  // Tabel frekuensi untuk modus
  html += "<table>";
  html += "<tr><th>Interval</th><th>Frekuensi</th></tr>";
  
  for (let i = 0; i < dataKelompok.length; i++) {
    let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
    let f = frekuensi[i];
    if (i === modeGroupIndex) {
      interval = `<strong>${interval}</strong> (frekuensi tertinggi)`;
      f = `<strong>${f}</strong>`;
    }
    html += `<tr><td>${interval}</td><td>${f}</td></tr>`;
  }
  html += "</table>";
  
  html += `<p><strong>Modus:</strong> ${stats.mode} (dari interval ${modeLowerBound}-${modeUpperBound})</p>`;
  
  html += "</div>";
  
  document.getElementById("outputKelompok").innerHTML = html;
}