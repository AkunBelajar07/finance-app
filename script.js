// ================= FIREBASE =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔴 GANTI DENGAN CONFIG KAMU
const firebaseConfig = {
  apiKey: "AIzaSyCLNxrhvy6Tt0CKyhOkXHUGUo5Ga4oyvpI",
  authDomain: "finance-app-15f6c.firebaseapp.com",
  projectId: "finance-app-15f6c",
  storageBucket: "finance-app-15f6c.firebasestorage.app",
  messagingSenderId: "888435597860",
  appId: "1:888435597860:web:862338fb8ce6e38d142eb1",
  measurementId: "G-SEWT08VYS6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= ROLE =================
const params = new URLSearchParams(window.location.search);
const role = params.get("role") || "admin";

// ================= DATA =================
let data = [];

// ================= TAMBAH =================
async function tambah() {
  if (role !== "admin") return alert("Akses ditolak!");

  const d = deskripsi.value;
  const j = parseFloat(jumlah.value);
  const k = kategori.value;
  const t = tanggal.value;
  const jenis = document.getElementById("jenis").value;

  if (!d || !j || !t) return alert("Isi semua!");

  await addDoc(collection(db, "transaksi"), {
    deskripsi: d,
    jumlah: j,
    kategori: k,
    tanggal: t,
    jenis: jenis
  });

  deskripsi.value = "";
  jumlah.value = "";
}

// ================= DELETE =================
async function hapus(id) {
  if (role !== "admin") return alert("Akses ditolak!");
  await deleteDoc(doc(db, "transaksi", id));
}

// ================= LISTENER REALTIME 🔥 =================
onSnapshot(collection(db, "transaksi"), (snapshot) => {
  data = [];
  snapshot.forEach((docu) => {
    data.push({ id: docu.id, ...docu.data() });
  });
  render();
});

// ================= UI =================
function formatRupiah(a) {
  return new Intl.NumberFormat("id-ID").format(a);
}

function render() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let masuk = 0, keluar = 0;

  data.forEach((t) => {
    if (t.jenis === "pemasukan") masuk += t.jumlah;
    else keluar += t.jumlah;

    list.innerHTML += `
      <div class="bg-white p-3 rounded-xl shadow flex justify-between">
        <div>
          <p>${t.deskripsi}</p>
          <p class="text-sm">${t.kategori} • ${t.tanggal}</p>
          <p class="${t.jenis === 'pemasukan' ? 'text-green-500' : 'text-red-500'}">
            ${t.jenis === 'pemasukan' ? '+' : '-'} Rp ${formatRupiah(t.jumlah)}
          </p>
        </div>
        ${role === "admin" ? `<button onclick="hapus('${t.id}')">❌</button>` : ""}
      </div>
    `;
  });

  document.getElementById("saldo").innerText =
    "Rp " + formatRupiah(masuk - keluar);
}

// ================= EVENT =================
document.getElementById("btnSimpan").addEventListener("click", tambah);

// ================= VIEWER MODE =================
window.addEventListener("DOMContentLoaded", () => {
  if (role === "viewer") {
    const form = document.getElementById("formContainer");
    if (form) form.remove();
  }
});
