/* =========================================
   ZISWAF DIGITAL - SCRIPT.JS
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       NAVIGASI
    ========================================= */

    const pages = document.querySelectorAll(".page");
    const menuLinks = document.querySelectorAll(".menu-link");
    const navLinks = document.querySelectorAll(".nav-menu .menu-link");


    /* =========================================
       MENU HAMBURGER MOBILE
    ========================================= */

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });

        navMenu.querySelectorAll(".menu-link").forEach(link => {

            link.addEventListener("click", function () {
                navMenu.classList.remove("active");
            });

        });

    }


    function showPage(pageId) {

        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        const targetPage =
            document.getElementById(pageId);

        if (targetPage) {
            targetPage.classList.add("active-page");
            targetPage.scrollTop = 0;
        }

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.page === pageId
            );
        });

    }

    
  


    function showPage(pageId) {

        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        const targetPage = document.getElementById(pageId);

        if (targetPage) {
            targetPage.classList.add("active-page");
            targetPage.scrollTop = 0;
        }

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.dataset.page === pageId
            );
        });
    }

    menuLinks.forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const pageId = this.dataset.page;

            if (pageId) {
                showPage(pageId);
            }

        });

    });


    /* =========================================
       FORMAT RUPIAH
    ========================================= */

    function formatRupiah(number) {

        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(Number(number) || 0);

    }


    /* =========================================
       NOMINAL DONASI
    ========================================= */

    const nominalButtons =
        document.querySelectorAll(".nominal-btn");

    const customAmount =
        document.getElementById("customAmount");

    const totalAmount =
        document.getElementById("totalAmount");

    let selectedAmount = 0;

    function updateTotal() {

        let amount = selectedAmount;

        if (customAmount && customAmount.value) {
            amount = Number(customAmount.value);
        }

        if (!amount || amount < 0) {
            amount = 0;
        }

        if (totalAmount) {
            totalAmount.textContent =
                formatRupiah(amount);
        }
    }


    nominalButtons.forEach(button => {

        button.addEventListener("click", function () {

            nominalButtons.forEach(btn => {
                btn.classList.remove("selected");
            });

            this.classList.add("selected");

            selectedAmount =
                Number(
                    this.textContent.replace(/\D/g, "")
                );

            if (customAmount) {
                customAmount.value = "";
            }

            updateTotal();

        });

    });


    if (customAmount) {

        customAmount.addEventListener("input", function () {

            nominalButtons.forEach(btn => {
                btn.classList.remove("selected");
            });

            selectedAmount = 0;

            updateTotal();

        });

    }


    /* =========================================
       DATA DONASI
    ========================================= */

    let donations =
        JSON.parse(
            localStorage.getItem("ziswafDonations")
        ) || [];

    const donationList =
        document.getElementById("donationList");


    /* =========================================
       DASHBOARD BERANDA
    ========================================= */

    const totalDonatur =
        document.getElementById("totalDonatur");

    const totalDana =
        document.getElementById("totalDana");

    const totalProgram =
        document.getElementById("totalProgram");


    /* =========================================
       DASHBOARD TRANSPARANSI
    ========================================= */

    const transparencyDonatur =
        document.querySelector(".transparency-total-donatur");

    const transparencyDana =
        document.querySelector(".transparency-total-dana");

    const transparencyProgram =
        document.querySelector(".transparency-total-program");


    /* =========================================
       UPDATE DASHBOARD
    ========================================= */

    function updateDashboard() {

        const jumlahDonatur =
            donations.length;

        const jumlahDana =
            donations.reduce(
                (total, donation) =>
                    total + Number(donation.amount || 0),
                0
            );

        const programUnik =
            new Set(
                donations
                    .map(donation => donation.program)
                    .filter(Boolean)
            );


        /* =========================================
           BERANDA
        ========================================= */

        if (totalDonatur) {
            totalDonatur.textContent =
                jumlahDonatur > 0
                    ? jumlahDonatur + "+"
                    : "0";
        }

        if (totalDana) {
            totalDana.textContent =
                formatRupiah(jumlahDana);
        }

        if (totalProgram) {
            totalProgram.textContent =
                programUnik.size > 0
                    ? programUnik.size + "+"
                    : "0";
        }


        /* =========================================
           TRANSPARANSI
        ========================================= */

        if (transparencyDonatur) {
            transparencyDonatur.textContent =
                jumlahDonatur;
        }

        if (transparencyDana) {
            transparencyDana.textContent =
                formatRupiah(jumlahDana);
        }

        if (transparencyProgram) {
            transparencyProgram.textContent =
                programUnik.size;
        }

    }


    /* =========================================
       TABEL DONASI
    ========================================= */

    function renderDonations() {

        if (!donationList) return;

        donationList.innerHTML = "";

        if (donations.length === 0) {

            donationList.innerHTML = `
                <tr>
                    <td colspan="5"
                        style="text-align:center;color:#7b877f;">
                        Belum ada donasi terbaru.
                    </td>
                </tr>
            `;

            return;
        }


        donations.forEach(donation => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${donation.nama}</td>
                <td>${donation.jenis}</td>
                <td>${donation.program}</td>
                <td>${formatRupiah(donation.amount)}</td>
                <td>
                    <span class="status">
                        ${donation.status}
                    </span>
                </td>
            `;

            donationList.appendChild(row);

        });

    }


    /* =========================================
       TAMPILKAN DATA AWAL
    ========================================= */

    renderDonations();
    updateDashboard();


    /* =========================================
       FORM DONASI
    ========================================= */

    const donationForm =
        document.getElementById("donationForm");

    let currentDonation = null;


    /* =========================================
       BUAT MODAL QRIS
    ========================================= */

    function createQRISModal() {

        if (document.getElementById("qrisModal")) {
            return;
        }

        const modal =
            document.createElement("div");

        modal.id = "qrisModal";
        modal.className = "qris-modal";

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

        document.body.appendChild(modal);


        /* =========================================
           TOMBOL X
        ========================================= */

        const closeButton =
            document.getElementById("qrisClose");

        closeButton.addEventListener("click", function () {

            modal.classList.remove("show");
            modal.style.display = "";

        });


        /* =========================================
           KLIK LUAR MODAL
        ========================================= */

        modal.addEventListener("click", function (e) {

            if (e.target === modal) {

                modal.classList.remove("show");
                modal.style.display = "";

            }

        });


        /* =========================================
           TOMBOL SUDAH MEMBAYAR
        ========================================= */

        const paidButton =
            document.getElementById("qrisPaidModal");

        paidButton.addEventListener(
            "click",
            confirmPayment
        );

    }


    createQRISModal();


    /* =========================================
       SUBMIT FORM DONASI
    ========================================= */

    if (donationForm) {

        donationForm.addEventListener(
            "submit",
            function (e) {

                e.preventDefault();


                const namaInput =
                    document.getElementById("nama");

                const jenisInput =
                    document.getElementById("jenis");

                const programInput =
                    document.getElementById("program-select");

                const anonymousInput =
                    document.getElementById("anonymous");


                const nama =
                    namaInput.value.trim();

                const jenis =
                    jenisInput.options[
                        jenisInput.selectedIndex
                    ].text;

                const program =
                    programInput.value;


                let amount = selectedAmount;

                if (
                    customAmount &&
                    customAmount.value
                ) {

                    amount =
                        Number(customAmount.value);

                }


                /* =========================================
                   VALIDASI NAMA
                ========================================= */

                if (!nama) {

                    alert(
                        "Silakan masukkan nama donatur."
                    );

                    namaInput.focus();

                    return;
                }


                /* =========================================
                   VALIDASI NOMINAL
                ========================================= */

                if (!amount || amount < 1000) {

                    alert(
                        "Silakan pilih nominal donasi minimal Rp1.000."
                    );

                    return;
                }


                /* =========================================
                   NAMA
                ========================================= */

                const displayName =
                    anonymousInput &&
                    anonymousInput.checked
                        ? "Hamba Allah"
                        : nama;


                /* =========================================
                   DATA SEMENTARA
                ========================================= */

                currentDonation = {

                    nama: displayName,

                    jenis: jenis,

                    program: program,

                    amount: amount,

                    status: "Menunggu"

                };


                /* =========================================
                   ISI DATA QRIS
                ========================================= */

                const modal =
                    document.getElementById("qrisModal");

                document.getElementById(
                    "qrisProgram"
                ).textContent =
                    `${jenis} • ${program}`;

                document.getElementById(
                    "qrisAmount"
                ).textContent =
                    formatRupiah(amount);


                /* =========================================
                   TAMPILKAN QRIS
                ========================================= */

                modal.classList.add("show");
                modal.style.display = "flex";

            }
        );

    }


    /* =========================================
       KONFIRMASI PEMBAYARAN
    ========================================= */

    function confirmPayment() {

        if (!currentDonation) {

            alert(
                "Data donasi belum tersedia."
            );

            return;
        }


        /* =========================================
           UBAH STATUS
        ========================================= */

        currentDonation.status = "Selesai";


        /* =========================================
           SIMPAN DONASI
        ========================================= */

        donations.unshift(currentDonation);

        localStorage.setItem(
            "ziswafDonations",
            JSON.stringify(donations)
        );


        /* =========================================
           UPDATE SEMUA DATA
        ========================================= */

        renderDonations();

        updateDashboard();


        /* =========================================
           TUTUP QRIS
        ========================================= */

        const modal =
            document.getElementById("qrisModal");

        if (modal) {

            modal.classList.remove("show");
            modal.style.display = "none";

        }


        /* =========================================
           RESET FORM
        ========================================= */

        if (donationForm) {
            donationForm.reset();
        }

        selectedAmount = 0;

        nominalButtons.forEach(button => {
            button.classList.remove("selected");
        });

        updateTotal();


        /* =========================================
           HAPUS DATA SEMENTARA
        ========================================= */

        currentDonation = null;


        /* =========================================
           PINDAH KE TRANSPARANSI
        ========================================= */

        showPage("transparansi");


        alert(
            "Alhamdulillah! Donasi berhasil dicatat. Terima kasih atas kebaikanmu 🤲"
        );

    }


    /* =========================================
       ESC UNTUK TUTUP QRIS
    ========================================= */

    document.addEventListener(
        "keydown",
        function (e) {

            if (e.key === "Escape") {

                const modal =
                    document.getElementById("qrisModal");

                if (modal) {

                    modal.classList.remove("show");
                    modal.style.display = "";

                }

            }

        }
    );


    /* =========================================
       TOTAL AWAL
    ========================================= */

    updateTotal();
    updateDashboard();

});