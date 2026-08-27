/* =========================================
   ZISWAF DIGITAL - SCRIPT.JS
   DATABASE ONLINE FIREBASE
   VERSI FIX MENU + FIREBASE
   ========================================= */


/* =========================================
   FIREBASE CONFIG
   ========================================= */

const firebaseConfig = {
    apiKey: "AIzaSyCeeDdqNVV07VYVGYSF9Wm2FpfsknOgNR0",
    authDomain: "ziswaf-digital.firebaseapp.com",
    projectId: "ziswaf-digital",
    storageBucket: "ziswaf-digital.firebasestorage.app",
    messagingSenderId: "695185758754",
    appId: "1:695185758754:web:1eccca853e07c71442887b",
    measurementId: "G-Y5MG2TGYP5"
};


/* =========================================
   GLOBAL VARIABLE
   ========================================= */

let db = null;

let donations = [];

let selectedAmount = 0;

let currentDonation = null;


/* =========================================
   DOM READY
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       NAVIGASI
       JALAN DULUAN SEBELUM FIREBASE
       ========================================= */

    const pages =
        document.querySelectorAll(".page");

    const menuLinks =
        document.querySelectorAll(".menu-link");

    const navLinks =
        document.querySelectorAll(".nav-menu .menu-link");


    /* =========================================
       MENU TITIK 3 / MOBILE
       ========================================= */

    /* =========================================
   MENU MOBILE
   ========================================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        console.log("MENU:", isOpen ? "TERBUKA" : "TERTUTUP");

    });


    /* Klik menu */

    navMenu.querySelectorAll(".menu-link").forEach(function (link) {

        link.addEventListener("click", function () {

            navMenu.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    /* Klik di luar */

    document.addEventListener("click", function (e) {

        if (
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)
        ) {

            navMenu.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

}


    /* =========================================
       LINK MENU
       ========================================= */

    menuLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                const pageId =
                    this.dataset.page;


                if (pageId) {

                    showPage(pageId);

                }

            }
        );

    });


    /* =========================================
       FORMAT RUPIAH
       ========================================= */

    function formatRupiah(number) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0
            }
        ).format(Number(number) || 0);

    }


    /* =========================================
       NOMINAL DONASI
       ========================================= */

    const nominalButtons =
        document.querySelectorAll(
            ".nominal-btn"
        );


    const customAmount =
        document.getElementById(
            "customAmount"
        );


    const totalAmount =
        document.getElementById(
            "totalAmount"
        );


    function updateTotal() {

        let amount =
            selectedAmount;


        if (
            customAmount &&
            customAmount.value
        ) {

            amount =
                Number(
                    customAmount.value
                );

        }


        if (
            !amount ||
            amount < 0
        ) {

            amount = 0;

        }


        if (totalAmount) {

            totalAmount.textContent =
                formatRupiah(amount);

        }

    }


    /* =========================================
       TOMBOL NOMINAL
       ========================================= */

    nominalButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {


                nominalButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "selected"
                        );

                    }
                );


                this.classList.add(
                    "selected"
                );


                selectedAmount =
                    Number(
                        this.textContent.replace(
                            /\D/g,
                            ""
                        )
                    );


                if (customAmount) {

                    customAmount.value = "";

                }


                updateTotal();

            }
        );

    });


    /* =========================================
       NOMINAL CUSTOM
       ========================================= */

    if (customAmount) {

        customAmount.addEventListener(
            "input",
            function () {


                nominalButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "selected"
                        );

                    }
                );


                selectedAmount = 0;

                updateTotal();

            }
        );

    }


    /* =========================================
       DASHBOARD
       ========================================= */

    const totalDonatur =
        document.getElementById(
            "totalDonatur"
        );


    const totalDana =
        document.getElementById(
            "totalDana"
        );


    const totalProgram =
        document.getElementById(
            "totalProgram"
        );


    /* =========================================
       TRANSPARANSI
       ========================================= */

    const transparencyDonatur =
        document.querySelector(
            ".transparency-total-donatur"
        );


    const transparencyDana =
        document.querySelector(
            ".transparency-total-dana"
        );


    const transparencyProgram =
        document.querySelector(
            ".transparency-total-program"
        );


    /* =========================================
       UPDATE DASHBOARD
       ========================================= */

    function updateDashboard() {

        const jumlahDonatur =
            donations.length;


        const jumlahDana =
            donations.reduce(
                function (total, donation) {

                    return total +
                        Number(
                            donation.amount || 0
                        );

                },
                0
            );


        const programUnik =
            new Set(
                donations
                    .map(function (donation) {

                        return donation.program;

                    })
                    .filter(Boolean)
            );


        /* BERANDA */

        if (totalDonatur) {

            totalDonatur.textContent =
                jumlahDonatur > 0
                    ? jumlahDonatur + "+"
                    : "0";

        }


        if (totalDana) {

            totalDana.textContent =
                formatRupiah(
                    jumlahDana
                );

        }


        if (totalProgram) {

            totalProgram.textContent =
                programUnik.size > 0
                    ? programUnik.size + "+"
                    : "0";

        }


        /* TRANSPARANSI */

        if (transparencyDonatur) {

            transparencyDonatur.textContent =
                jumlahDonatur;

        }


        if (transparencyDana) {

            transparencyDana.textContent =
                formatRupiah(
                    jumlahDana
                );

        }


        if (transparencyProgram) {

            transparencyProgram.textContent =
                programUnik.size;

        }

    }


    /* =========================================
       TABEL DONASI
       ========================================= */

    const donationList =
        document.getElementById(
            "donationList"
        );


    function renderDonations() {

        if (!donationList) return;


        donationList.innerHTML = "";


        if (donations.length === 0) {

            donationList.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="
                            text-align:center;
                            color:#7b877f;
                        ">
                        Belum ada donasi terbaru.
                    </td>
                </tr>
            `;

            return;

        }


        donations.forEach(
            function (donation) {

                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `
                    <td>
                        ${donation.nama || "-"}
                    </td>

                    <td>
                        ${donation.jenis || "-"}
                    </td>

                    <td>
                        ${donation.program || "-"}
                    </td>

                    <td>
                        ${formatRupiah(
                            donation.amount
                        )}
                    </td>

                    <td>
                        <span class="status">
                            ${donation.status || "Selesai"}
                        </span>
                    </td>
                `;


                donationList.appendChild(
                    row
                );

            }
        );

    }


    /* =========================================
       CREATE QRIS MODAL
       ========================================= */

    function createQRISModal() {

        if (
            document.getElementById(
                "qrisModal"
            )
        ) {

            return;

        }


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "qrisModal";


        modal.className =
            "qris-modal";


        modal.innerHTML = `

            <div class="qris-box">

                <button
                    type="button"
                    class="qris-close"
                    id="qrisClose">
                    ×
                </button>

                <div class="qris-icon">
                    💳
                </div>

                <h2>
                    Pembayaran QRIS
                </h2>

                <p
                    class="qris-program"
                    id="qrisProgram">
                    Program
                </p>

                <div
                    class="qris-amount"
                    id="qrisAmount">
                    Rp0
                </div>

                <div class="qris-image">

                    <img
                        src="ziswaf.png"
                        alt="QRIS Pembayaran"
                        onerror="
                            this.style.display='none';
                            this.parentElement.innerHTML =
                            '<p style=&quot;
                            color:#718078;
                            font-size:13px;
                            padding:50px 10px;
                            &quot;>
                            QRIS belum tersedia.<br>
                            Pastikan file <b>ziswaf.png</b>
                            berada satu folder dengan index.html.
                            </p>';
                        "
                    >

                </div>

                <p class="qris-instruction">
                    Scan kode QRIS menggunakan aplikasi
                    pembayaran yang mendukung QRIS.
                </p>

                <div class="qris-status">

                    <span class="status-dot"></span>

                    Menunggu pembayaran...

                </div>

                <button
                    type="button"
                    class="qris-paid"
                    id="qrisPaidModal">
                    Saya Sudah Membayar
                </button>

            </div>

        `;


        document.body.appendChild(
            modal
        );


        /* CLOSE */

        const closeButton =
            document.getElementById(
                "qrisClose"
            );


        closeButton.addEventListener(
            "click",
            function () {

                modal.style.display =
                    "none";

            }
        );


        /* KLIK LUAR */

        modal.addEventListener(
            "click",
            function (e) {

                if (
                    e.target === modal
                ) {

                    modal.style.display =
                        "none";

                }

            }
        );


        /* PAID */

        const paidButton =
            document.getElementById(
                "qrisPaidModal"
            );


        paidButton.addEventListener(
            "click",
            confirmPayment
        );

    }


    createQRISModal();


    /* =========================================
       FORM DONASI
       ========================================= */

    const donationForm =
        document.getElementById(
            "donationForm"
        );


    if (donationForm) {

        donationForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const namaInput =
                    document.getElementById(
                        "nama"
                    );


                const jenisInput =
                    document.getElementById(
                        "jenis"
                    );


                const programInput =
                    document.getElementById(
                        "program-select"
                    );


                const anonymousInput =
                    document.getElementById(
                        "anonymous"
                    );


                const nama =
                    namaInput
                        ? namaInput.value.trim()
                        : "";


                const jenis =
                    jenisInput &&
                    jenisInput.selectedIndex >= 0
                        ? jenisInput.options[
                            jenisInput.selectedIndex
                        ].text
                        : "-";


                const program =
                    programInput
                        ? programInput.value
                        : "-";


                let amount =
                    selectedAmount;


                if (
                    customAmount &&
                    customAmount.value
                ) {

                    amount =
                        Number(
                            customAmount.value
                        );

                }


                /* VALIDASI */

                if (!nama) {

                    alert(
                        "Silakan masukkan nama donatur."
                    );

                    if (namaInput) {

                        namaInput.focus();

                    }

                    return;

                }


                if (
                    !amount ||
                    amount < 1000
                ) {

                    alert(
                        "Silakan pilih nominal donasi minimal Rp1.000."
                    );

                    return;

                }


                const displayName =
                    anonymousInput &&
                    anonymousInput.checked
                        ? "Hamba Allah"
                        : nama;


                /* DATA */

                currentDonation = {

                    nama:
                        displayName,

                    jenis:
                        jenis,

                    program:
                        program,

                    amount:
                        amount,

                    status:
                        "Menunggu"

                };


                /* QRIS */

                const modal =
                    document.getElementById(
                        "qrisModal"
                    );


                const qrisProgram =
                    document.getElementById(
                        "qrisProgram"
                    );


                const qrisAmount =
                    document.getElementById(
                        "qrisAmount"
                    );


                if (qrisProgram) {

                    qrisProgram.textContent =
                        `${jenis} • ${program}`;

                }


                if (qrisAmount) {

                    qrisAmount.textContent =
                        formatRupiah(
                            amount
                        );

                }


                if (modal) {

                    modal.style.display =
                        "flex";

                }

            }
        );

    }


    /* =========================================
       KONFIRMASI PEMBAYARAN
       ========================================= */

    async function confirmPayment() {

        if (!currentDonation) {

            alert(
                "Data donasi belum tersedia."
            );

            return;

        }


        if (!db) {

            alert(
                "Firebase masih belum terhubung. Tunggu sebentar lalu coba lagi."
            );

            return;

        }


        currentDonation.status =
            "Selesai";


        try {

            await window.firebaseAddDoc(

                window.firebaseCollection(
                    db,
                    "donations"
                ),

                {

                    nama:
                        currentDonation.nama,

                    jenis:
                        currentDonation.jenis,

                    program:
                        currentDonation.program,

                    amount:
                        Number(
                            currentDonation.amount
                        ),

                    status:
                        "Selesai",

                    createdAt:
                        Date.now()

                }

            );


            console.log(
                "Donasi berhasil disimpan ke Firebase."
            );


        } catch (error) {

            console.error(
                "Gagal menyimpan donasi:",
                error
            );


            alert(
                "Donasi gagal dicatat ke database. Periksa koneksi internet."
            );

            return;

        }


        /* TUTUP MODAL */

        const modal =
            document.getElementById(
                "qrisModal"
            );


        if (modal) {

            modal.style.display =
                "none";

        }


        /* RESET */

        if (donationForm) {

            donationForm.reset();

        }


        selectedAmount = 0;


        nominalButtons.forEach(
            function (button) {

                button.classList.remove(
                    "selected"
                );

            }
        );


        updateTotal();


        currentDonation = null;


        /* TRANSPARANSI */

        showPage(
            "transparansi"
        );


        alert(
            "Alhamdulillah! Donasi berhasil dicatat. Terima kasih atas kebaikanmu 🤲"
        );

    }


    /* =========================================
       ESC CLOSE QRIS
       ========================================= */

    document.addEventListener(
        "keydown",
        function (e) {

            if (
                e.key === "Escape"
            ) {

                const modal =
                    document.getElementById(
                        "qrisModal"
                    );


                if (modal) {

                    modal.style.display =
                        "none";

                }

            }

        }
    );


    /* =========================================
       TOTAL AWAL
       ========================================= */

    updateTotal();

    updateDashboard();


    /* =========================================
       FIREBASE
       DIMULAI SETELAH MENU AKTIF
       ========================================= */

    initializeFirebase();


});


/* =========================================
   FIREBASE INITIALIZATION
   ========================================= */

async function initializeFirebase() {

    try {

        const {
            initializeApp
        } =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"
            );


        const {
            getFirestore,
            collection,
            addDoc,
            onSnapshot
        } =
            await import(
                "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
            );


        const app =
            initializeApp(
                firebaseConfig
            );


        db =
            getFirestore(
                app
            );


        /* GLOBAL */

        window.firebaseDB =
            db;

        window.firebaseCollection =
            collection;

        window.firebaseAddDoc =
            addDoc;

        window.firebaseOnSnapshot =
            onSnapshot;


        console.log(
            "Firebase berhasil terhubung."
        );


        /* =========================================
           REALTIME DONASI
           ========================================= */

        const donationsRef =
            collection(
                db,
                "donations"
            );


        onSnapshot(
            donationsRef,

            function (snapshot) {

                console.log(
                    "JUMLAH DATA FIRESTORE:",
                    snapshot.size
                );


                donations =
                    snapshot.docs.map(
                        function (doc) {

                            return {
                                id: doc.id,
                                ...doc.data()
                            };

                        }
                    );


                renderDonationsGlobal();

                updateDashboardGlobal();

            },

            function (error) {

                console.error(
                    "ERROR FIRESTORE:",
                    error
                );

            }
        );


    } catch (error) {

        console.error(
            "Firebase gagal terhubung:",
            error
        );

        console.warn(
            "Menu website tetap aktif walaupun Firebase gagal."
        );

    }

}


/* =========================================
   GLOBAL RENDER DONASI
   ========================================= */

function renderDonationsGlobal() {

    const donationList =
        document.getElementById(
            "donationList"
        );


    if (!donationList) return;


    donationList.innerHTML = "";


    if (
        !donations ||
        donations.length === 0
    ) {

        donationList.innerHTML = `
            <tr>
                <td colspan="5"
                    style="
                        text-align:center;
                        color:#7b877f;
                    ">
                    Belum ada donasi terbaru.
                </td>
            </tr>
        `;

        return;

    }


    donations.forEach(
        function (donation) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `
                <td>
                    ${donation.nama || "-"}
                </td>

                <td>
                    ${donation.jenis || "-"}
                </td>

                <td>
                    ${donation.program || "-"}
                </td>

                <td>
                    ${formatRupiahGlobal(
                        donation.amount
                    )}
                </td>

                <td>
                    <span class="status">
                        ${donation.status || "Selesai"}
                    </span>
                </td>
            `;


            donationList.appendChild(
                row
            );

        }
    );

}


/* =========================================
   GLOBAL DASHBOARD
   ========================================= */

function updateDashboardGlobal() {

    const totalDonatur =
        document.getElementById(
            "totalDonatur"
        );


    const totalDana =
        document.getElementById(
            "totalDana"
        );


    const totalProgram =
        document.getElementById(
            "totalProgram"
        );


    const transparencyDonatur =
        document.querySelector(
            ".transparency-total-donatur"
        );


    const transparencyDana =
        document.querySelector(
            ".transparency-total-dana"
        );


    const transparencyProgram =
        document.querySelector(
            ".transparency-total-program"
        );


    const jumlahDonatur =
        donations.length;


    const jumlahDana =
        donations.reduce(
            function (total, donation) {

                return total +
                    Number(
                        donation.amount || 0
                    );

            },
            0
        );


    const programUnik =
        new Set(
            donations
                .map(
                    function (donation) {

                        return donation.program;

                    }
                )
                .filter(Boolean)
        );


    if (totalDonatur) {

        totalDonatur.textContent =
            jumlahDonatur > 0
                ? jumlahDonatur + "+"
                : "0";

    }


    if (totalDana) {

        totalDana.textContent =
            formatRupiahGlobal(
                jumlahDana
            );

    }


    if (totalProgram) {

        totalProgram.textContent =
            programUnik.size > 0
                ? programUnik.size + "+"
                : "0";

    }


    if (transparencyDonatur) {

        transparencyDonatur.textContent =
            jumlahDonatur;

    }


    if (transparencyDana) {

        transparencyDana.textContent =
            formatRupiahGlobal(
                jumlahDana
            );

    }


    if (transparencyProgram) {

        transparencyProgram.textContent =
            programUnik.size;

    }

}


/* =========================================
   GLOBAL FORMAT RUPIAH
   ========================================= */

function formatRupiahGlobal(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(
        Number(number) || 0
    );

}
/* =========================================
   FUNGSI PINDAH HALAMAN
   ========================================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");
    const menuLinks = document.querySelectorAll(".menu-link");

    // Sembunyikan semua halaman
    pages.forEach(function (page) {
        page.classList.remove("active-page");
    });

    // Tampilkan halaman yang dipilih
    const targetPage = document.getElementById(pageId);

    if (targetPage) {
        targetPage.classList.add("active-page");
    }

    // Update menu aktif
    menuLinks.forEach(function (link) {
        link.classList.remove("active");

        if (link.dataset.page === pageId) {
            link.classList.add("active");
        }
    });

    // Tutup menu HP
    const navMenu = document.getElementById("navMenu");
    const menuToggle = document.getElementById("menuToggle");

    if (navMenu) {
        navMenu.classList.remove("active");
    }

    if (menuToggle) {
        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );
    }

    // Kembali ke atas
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}