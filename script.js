/**
 * Data Playground - Script.js
 * File ini berisi seluruh logika interaktif untuk aplikasi Data Playground Statistika
 */

// ===== VARIABEL GLOBAL =====

// Variabel untuk menyimpan chart histogram yang akan diperbarui
let histogramChart;

// Data awal yang ditampilkan saat aplikasi pertama kali dijalankan
let currentData = [10, 12, 9, 15, 20, 18, 14];

// ===== INISIALISASI APLIKASI =====

/**
 * Fungsi yang dijalankan saat halaman dimuat
 * Memproses data awal dan menginisialisasi chart
 */
window.onload = function() {
  // Tambahkan event listener untuk checkbox tampilkan langkah
  document.getElementById("showSteps").addEventListener("change", prosesData);
  
  prosesData();
  initChart(currentData);
};

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