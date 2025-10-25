/**
 * Data Playground - Script.js
 * File ini berisi seluruh logika interaktif untuk aplikasi Data Playground Statistika
 */

// ===== VARIABEL GLOBAL =====

// Variabel untuk menyimpan chart histogram yang akan diperbarui
let histogramChart;
let histogramChartKelompok;

// Data awal yang ditampilkan saat aplikasi pertama kali dijalankan
let currentData = [10, 12, 9, 15, 20, 18, 14];

// Data awal untuk data kelompok (format: [[batas_bawah, batas_atas, frekuensi], ...])
let currentDataKelompok = [
  [1, 10, 5],
  [11, 20, 8],
  [21, 30, 12]
];

// ===== DATA TUGAS UNTUK SETIAP MAHASISWA =====

// Daftar tugas untuk data tunggal
const tugasDataTunggal = [
  "Masukkan data tinggi badan (dalam cm) teman sekelas Anda (minimal 10 data)",
  "Masukkan data berat badan (dalam kg) teman sekelas Anda (minimal 10 data)",
  "Masukkan data usia (dalam tahun) teman sekelas Anda (minimal 10 data)",
  "Masukkan data nilai ujian matematika teman sekelas Anda (skala 0-100, minimal 10 data)",
  "Masukkan data jumlah saudara kandung teman sekelas Anda (minimal 10 data)",
  "Masukkan data lama waktu perjalanan ke kampus (dalam menit) teman sekelas Anda (minimal 10 data)",
  "Masukkan data pengeluaran harian (dalam ribuan rupiah) teman sekelas Anda (minimal 10 data)",
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
  "Masukkan data kelompok jumlah jam belajar per minggu teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok jarak rumah ke kampus (dalam km) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok pengeluaran bulanan (dalam ribuan rupiah) teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok IPK teman sekelas Anda (skala 0.00-4.00, minimal 5 kelompok)",
  "Masukkan data kelompok jumlah kehadiran kuliah per semester teman sekelas Anda (minimal 5 kelompok)",
  "Masukkan data kelompok waktu mengerjakan tugas (dalam jam) teman sekelas Anda (minimal 5 kelompok)"
];

// Variabel untuk menyimpan tugas yang di-generate
let currentTask = null;

// ===== INISIALISASI APLIKASI =====

/**
 * Fungsi sederhana untuk hash string menjadi angka
 * Digunakan untuk menghasilkan tugas yang konsisten berdasarkan ID mahasiswa
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
 * Fungsi untuk generate tugas berdasarkan ID mahasiswa
 */
function generateTask() {
  const studentId = document.getElementById("studentId").value.trim();
  
  if (!studentId) {
    alert("Silakan masukkan NIM/Nama Anda terlebih dahulu!");
    return;
  }
  
  // Hash ID mahasiswa untuk mendapatkan index yang konsisten
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
  
  prosesData();
  initChart(currentData);
  
  // Initialize data kelompok juga
  prosesDataKelompok();
  initChartKelompok(currentDataKelompok);
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
    "10, 12, 9, 15, 20, 18, 14",
    "23, 45, 67, 89, 12, 34, 56, 78, 90",
    "5, 10, 15, 20, 25, 30, 35, 40, 45, 50",
    "72, 75, 71, 73, 74, 76, 74, 71, 72"
  ];
  
  // Memilih dataset secara acak
  let randomIndex = Math.floor(Math.random() * datasets.length);
  document.getElementById("inputData").value = datasets[randomIndex];
  
  // Proses dataset yang dipilih
  prosesData();
}

/**
 * Fungsi untuk membersihkan semua data dan menghapus tampilan statistik
 * Dijalankan saat user klik tombol "Kosongkan"
 */
function clearData() {
  // Kosongkan area input
  document.getElementById("inputData").value = "";
  
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
  document.getElementById("std-value").textContent = "0.00";
  
  // Hapus chart jika ada
  if (histogramChart) {
    histogramChart.destroy();
  }
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
 * Fungsi untuk membuat histogram dari data
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
  
  // Tentukan nilai minimum dan maksimum data
  let min = Math.min(...data);
  let max = Math.max(...data);
  
  // Handling kasus nilai min dan max yang sama
  if (min === max) {
    min = min - 1;
    max = max + 1;
  }
  
  // Tentukan jumlah bin (kelompok data) untuk histogram
  // Pastikan bin minimal 3 dan maksimal 7, menggunakan aturan akar jumlah data
  let binCount = Math.max(3, Math.min(7, Math.ceil(Math.sqrt(data.length))));
  
  // Hitung ukuran bin yang tepat untuk distribusi data
  let binSize = Math.ceil((max - min) / binCount);
  
  // Pastikan binSize tidak nol
  if (binSize === 0) {
    binSize = 1;
  }
  
  // Bulatkan nilai minimum ke bawah untuk pembulatan yang lebih baik
  min = Math.floor(min);
  
  // Buat batas-batas bin
  let bins = [];
  for (let i = 0; i < binCount; i++) {
    let binStart = min + i * binSize;
    let binEnd = binStart + binSize;
    bins.push({
      start: binStart,
      end: binEnd,
      count: 0
    });
  }
  
  // Hitung jumlah nilai dalam masing-masing bin
  data.forEach(value => {
    let foundBin = false;
    
    for (let i = 0; i < bins.length; i++) {
      // Untuk bin terakhir, nilai pada bin end juga masuk dalam bin tersebut
      if (i === bins.length - 1) {
        if (value >= bins[i].start && value <= bins[i].end) {
          bins[i].count++;
          foundBin = true;
          break;
        }
      } 
      // Untuk bin lainnya, nilai pada bin end tidak masuk dalam bin
      else if (value >= bins[i].start && value < bins[i].end) {
        bins[i].count++;
        foundBin = true;
        break;
      }
    }
    
    // Jika tidak ada bin yang cocok (seharusnya tidak terjadi), tambahkan ke bin terakhir
    if (!foundBin && bins.length > 0) {
      bins[bins.length - 1].count++;
    }
  });
  
  // Buat label dan data untuk chart
  let labels = bins.map(bin => `${bin.start}-${bin.end}`);
  let chartData = bins.map(bin => bin.count);
  
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
  document.getElementById("std-value").textContent = "0.00";
  document.getElementById("tableOutput").innerHTML = "";
  
  // Reset chart
  if (histogramChart) {
    histogramChart.destroy();
  }
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

  // Hitung varians dan standar deviasi
  let variance = data.reduce((a,b) => a + Math.pow(b-mean,2),0) / data.length;
  let std = Math.sqrt(variance);
  
  // Update statistik cards
  document.getElementById("n-value").textContent = data.length;
  document.getElementById("mean-value").textContent = mean.toFixed(2);
  document.getElementById("median-value").textContent = median;
  document.getElementById("mode-value").textContent = mode;
  document.getElementById("std-value").textContent = std.toFixed(2);
  
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
    
    // VARIANCE
    html += "<h4>Variance</h4>";
    html += "<p class='rumus-desc'>Hitung selisih tiap nilai ke mean, kuadratkan setiap selisih, lalu rata-rata kuadrat selisih tersebut</p>";
    
    // Hitung selisih dan kuadrat selisih untuk ditampilkan
    let selisihArr = data.map(val => (val - mean).toFixed(2));
    let selisihSquaredArr = data.map(val => Math.pow(val - mean, 2).toFixed(2));
    
    // Rumus Variance dalam notasi matematika
    html += "<div class='formula'>";
    html += "<span class='formula-title'>Rumus Variance (σ²):</span>";
    html += "σ² = Σ(x - μ)² / n";
    
    html += "<div class='formula-steps'>";
    html += "σ² = [(";
    
    for (let i = 0; i < data.length; i++) {
      if (i > 0) html += " + ";
      html += "(" + data[i] + " - " + mean.toFixed(2) + ")²";
    }
    
    html += ")] / " + data.length;
    html += "<br>σ² = [" + selisihSquaredArr.join(" + ") + "] / " + data.length;
    html += "<br>σ² = " + selisihSquaredArr.reduce((a, b) => parseFloat(a) + parseFloat(b), 0).toFixed(2) + " / " + data.length;
    html += "<br>σ² = " + variance.toFixed(2);
    html += "</div>";
    html += "</div>";
    
    html += "<p><strong>Selisih dari mean:</strong> " + selisihArr.join(", ") + "</p>";
    html += "<p><strong>Kuadrat selisih:</strong> " + selisihSquaredArr.join(", ") + "</p>";
    html += "<p><strong>Variance:</strong> " + variance.toFixed(2) + "</p>";
    
    // STANDAR DEVIASI
    html += "<h4>Standar Deviasi</h4>";
    html += "<p class='rumus-desc'>Akar kuadrat dari variance</p>";
    
    // Rumus Standar Deviasi dalam notasi matematika
    html += "<div class='formula'>";
    html += "<span class='formula-title'>Rumus Standar Deviasi (σ):</span>";
    html += "σ = √σ² = √Variance";
    html += "<div class='formula-steps'>";
    html += "σ = √" + variance.toFixed(2);
    html += "<br>σ = " + std.toFixed(2);
    html += "</div>";
    html += "</div>";
    
    html += "<p><strong>Standar Deviasi:</strong> √" + variance.toFixed(2) + " = " + std.toFixed(2) + "</p>";
    
    html += "</div>";
    
    // Update tampilan output
    document.getElementById("output").innerHTML = html;
  } else {
    // Jika langkah perhitungan tidak dicentang, kosongkan area output
    document.getElementById("output").innerHTML = "";
  }
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
    "1-10:5, 11-20:8, 21-30:12",
    "50-59:10, 60-69:15, 70-79:20, 80-89:5",
    "0-9:3, 10-19:7, 20-29:12, 30-39:8, 40-49:4",
    "100-109:8, 110-119:15, 120-129:10, 130-139:5"
  ];
  
  // Memilih dataset secara acak
  let randomIndex = Math.floor(Math.random() * datasets.length);
  document.getElementById("inputDataKelompok").value = datasets[randomIndex];
  
  // Proses dataset yang dipilih
  prosesDataKelompok();
}

/**
 * Fungsi untuk membersihkan semua data kelompok dan menghapus tampilan statistik
 */
function clearDataKelompok() {
  // Kosongkan area input
  document.getElementById("inputDataKelompok").value = "";
  
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
  document.getElementById("std-value-kelompok").textContent = "0.00";
  
  // Hapus chart jika ada
  if (histogramChartKelompok) {
    histogramChartKelompok.destroy();
  }
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
    document.getElementById("std-value-kelompok").textContent = stats.std.toFixed(2);
    
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
 * @returns {Object} Object berisi nilai n, mean, median, mode, variance, dan std
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
  
  // Hitung variance dan standar deviasi
  let fxMinusMeanSquared = nilaiTengah.map((x, i) => frekuensi[i] * Math.pow(x - mean, 2));
  let sumFxMinusMeanSquared = fxMinusMeanSquared.reduce((sum, val) => sum + val, 0);
  let variance = sumFxMinusMeanSquared / n;
  let std = Math.sqrt(variance);
  
  return {
    n: n,
    mean: mean,
    median: median,
    mode: mode,
    variance: variance,
    std: std
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
  
  // STANDAR DEVIASI
  html += "<h4>Variance dan Standar Deviasi</h4>";
  html += "<p class='rumus-desc'>Perhitungan menggunakan nilai tengah interval</p>";
  
  // Hitung data untuk standar deviasi
  let fxMinusMeanSquared = nilaiTengah.map((x, i) => frekuensi[i] * Math.pow(x - stats.mean, 2));
  let sumFxMinusMeanSquared = fxMinusMeanSquared.reduce((sum, val) => sum + val, 0);
  
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Rumus Variance untuk Data Kelompok:</span>";
  html += "σ² = Σ[f × (x - μ)²] / n";
  
  html += "<div class='formula-steps'>";
  html += "σ² = (";
  for (let i = 0; i < nilaiTengah.length; i++) {
    if (i > 0) html += " + ";
    html += `${frekuensi[i]} × (${nilaiTengah[i].toFixed(1)} - ${stats.mean.toFixed(2)})²`;
  }
  html += ") / " + n;
  html += `<br>σ² = ${sumFxMinusMeanSquared.toFixed(2)} / ${n}`;
  html += `<br>σ² = ${stats.variance.toFixed(2)}`;
  html += "</div></div>";
  
  // Tabel perhitungan standar deviasi
  html += "<table>";
  html += "<tr><th>Interval</th><th>Frek (f)</th><th>Nilai Tengah (x)</th><th>x - μ</th><th>(x - μ)²</th><th>f × (x - μ)²</th></tr>";
  
  let totalFxMinusMeanSq = 0;
  
  for (let i = 0; i < dataKelompok.length; i++) {
    let interval = `${dataKelompok[i][0]}-${dataKelompok[i][1]}`;
    let f = frekuensi[i];
    let x = nilaiTengah[i];
    let xMinusMean = x - stats.mean;
    let xMinusMeanSq = Math.pow(xMinusMean, 2);
    let fxMinusMeanSq = f * xMinusMeanSq;
    
    html += `<tr>
      <td>${interval}</td>
      <td>${f}</td>
      <td>${x.toFixed(1)}</td>
      <td>${xMinusMean.toFixed(2)}</td>
      <td>${xMinusMeanSq.toFixed(2)}</td>
      <td>${fxMinusMeanSq.toFixed(2)}</td>
    </tr>`;
    
    totalFxMinusMeanSq += fxMinusMeanSq;
  }
  
  html += `<tr><td colspan="5">Total</td><td>${totalFxMinusMeanSq.toFixed(2)}</td></tr>`;
  html += "</table>";
  
  html += `<p><strong>Variance:</strong> ${stats.variance.toFixed(2)}</p>`;
  
  html += "<div class='formula'>";
  html += "<span class='formula-title'>Rumus Standar Deviasi (σ):</span>";
  html += "σ = √σ² = √Variance";
  html += "<div class='formula-steps'>";
  html += `σ = √${stats.variance.toFixed(2)}`;
  html += `<br>σ = ${stats.std.toFixed(2)}`;
  html += "</div></div>";
  
  html += `<p><strong>Standar Deviasi:</strong> ${stats.std.toFixed(2)}</p>`;
  
  html += "</div>";
  
  document.getElementById("outputKelompok").innerHTML = html;
}