/* -------------------------------------------------------------
   24K Realty JavaScript Controller
   Pure JS (Enterprise PropTech, EMI Calculator, Micro-Market Router,
   NRI Multi-Currency Switcher, Floor Plan Blueprint Modal, 3D Tilt)
   ------------------------------------------------------------- */

// Configuration: Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby1ce_nwOaFY0lTrZTqrz6g4lUMHSLXjwrB3xAloYIemsyfh2oRlTyUfXIMf04X_ucv/exec";

// Global currency state
let currentCurrency = "INR";
const currencyRates = {
    INR: { rate: 1, symbol: "₹", prefix: true },
    USD: { rate: 0.0116, symbol: "$", prefix: true },
    AED: { rate: 0.0425, symbol: "AED ", prefix: true }
};

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initCurrencySwitcher();
    initPropTechSearch();
    initMarketExplorer();
    initEmiCalculator();
    initBlueprintModal();
    initMagneticCardTilt();
    initWhatsAppWidget();
    initInquiryModal();
    initContactForms();
    initPropertyFilters();
    initPropertyDetailsRouter();
    initScrollReveal();
    initCounterAnimation();
});

/* --- 1. Sticky Navbar & Mobile Drawer --- */
function initNavbar() {
    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const drawerClose = document.getElementById("drawerClose");
    
    // Sticky scroll effect
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // Mobile nav toggle
    if (menuToggle && mobileDrawer && mobileOverlay) {
        menuToggle.addEventListener("click", () => {
            mobileDrawer.classList.toggle("open");
            mobileOverlay.classList.toggle("active");
            document.body.style.overflow = mobileDrawer.classList.contains("open") ? "hidden" : "auto";
        });
        
        mobileOverlay.addEventListener("click", closeDrawer);
        if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
        
        // Close menu when clicking link
        const drawerLinks = mobileDrawer.querySelectorAll("a");
        drawerLinks.forEach(link => {
            link.addEventListener("click", closeDrawer);
        });
    }

    function closeDrawer() {
        if (mobileDrawer) mobileDrawer.classList.remove("open");
        if (mobileOverlay) mobileOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

/* --- 2. NRI Multi-Currency Switcher --- */
function initCurrencySwitcher() {
    const currencyButtons = document.querySelectorAll(".currency-btn");
    if (!currencyButtons.length) return;

    currencyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedCurr = btn.getAttribute("data-currency");
            if (!selectedCurr || selectedCurr === currentCurrency) return;

            currentCurrency = selectedCurr;

            // Update button active state across desktop and mobile
            currencyButtons.forEach(b => {
                if (b.getAttribute("data-currency") === currentCurrency) {
                    b.classList.add("active");
                } else {
                    b.classList.remove("active");
                }
            });

            updatePricesAcrossSite();
        });
    });
}

function convertPriceFromINR(inrAmount) {
    if (currentCurrency === "INR") {
        if (inrAmount >= 10000000) {
            return `₹${(inrAmount / 10000000).toFixed(2)} Cr*`;
        }
        return `₹${(inrAmount / 100000).toFixed(0)} Lakh*`;
    } else if (currentCurrency === "USD") {
        const usdVal = Math.round(inrAmount * currencyRates.USD.rate);
        return `$${new Intl.NumberFormat("en-US").format(usdVal)}*`;
    } else if (currentCurrency === "AED") {
        const aedVal = Math.round(inrAmount * currencyRates.AED.rate);
        return `AED ${new Intl.NumberFormat("en-US").format(aedVal)}*`;
    }
    return `₹${inrAmount}`;
}

function updatePricesAcrossSite() {
    const priceElements = document.querySelectorAll("[data-inr-price]");
    priceElements.forEach(el => {
        const inr = parseFloat(el.getAttribute("data-inr-price"));
        if (!isNaN(inr)) {
            const formatted = convertPriceFromINR(inr);
            el.innerHTML = `${formatted} <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">onwards</span>`;
        }
    });

    // Re-trigger EMI calculator update if available
    const emiCalcEvent = new Event("input");
    const loanSlider = document.getElementById("loanAmountSlider");
    if (loanSlider) loanSlider.dispatchEvent(emiCalcEvent);
}

/* --- 3. PropTech Search Console Controller --- */
function initPropTechSearch() {
    const searchTabs = document.querySelectorAll(".search-tab-btn");
    const searchTypeInput = document.getElementById("searchType");
    const searchBtn = document.getElementById("filterSearchBtn");

    if (searchTabs.length > 0) {
        searchTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                searchTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                const targetCategory = tab.getAttribute("data-category") || "all";
                if (searchTypeInput) {
                    searchTypeInput.value = targetCategory;
                }
            });
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const type = document.getElementById("searchType") ? document.getElementById("searchType").value : "all";
            const location = document.getElementById("searchLocation") ? document.getElementById("searchLocation").value : "";
            const budget = document.getElementById("searchBudget") ? document.getElementById("searchBudget").value : "";
            
            let queryParams = [];
            if (type && type !== "all") queryParams.push(`type=${encodeURIComponent(type)}`);
            if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
            if (budget) queryParams.push(`budget=${encodeURIComponent(budget)}`);

            const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
            
            // Clean routing to properties directory
            const isSubDir = window.location.pathname.includes("/properties/") || window.location.pathname.includes("/about/") || window.location.pathname.includes("/services/") || window.location.pathname.includes("/contact/") || window.location.pathname.includes("/property/");
            const targetPath = isSubDir ? `../properties/${queryString}` : `properties/${queryString}`;
            window.location.href = targetPath;
        });
    }
}

/* --- 4. Pune Micro-Market Explorer & Yield Heatmap --- */
const marketDatabase = {
    baner: {
        name: "Baner",
        tagline: "Pune's High-Growth Western Luxury & Commercial Corridor",
        avgPrice: "₹9,400 / sq.ft.",
        rentalYield: "4.8% p.a.",
        growthRate: "+15.2% (3-Yr)",
        highlights: [
            "Proximity to Hinjewadi IT Park and Mumbai-Pune Expressway",
            "Upcoming Pune Metro Line 3 station within 5 minutes",
            "High-end social infra: Balewadi High Street, top international schools & hospitals",
            "Strong appreciation for 3 & 4 BHK luxury residences"
        ],
        image: "assets/images/millennium-falcon-banner.jpg",
        propertyLink: "properties/?location=Baner"
    },
    hinjewadi: {
        name: "Hinjewadi IT Zone",
        tagline: "India's Prominent IT Hub with Unrivalled Rental Demand",
        avgPrice: "₹7,800 / sq.ft.",
        rentalYield: "5.8% p.a.",
        growthRate: "+18.4% (3-Yr)",
        highlights: [
            "Over 400,000+ tech professionals driving constant rental yield",
            "Pune Metro Line 3 Phase 1 nearing operational rollout",
            "Integrated township living with resort-grade amenities (Godrej, Megapolis)",
            "Zero vacancy rate for modern 2 & 3 BHK gated communities"
        ],
        image: "assets/images/godrej-gale-banner.jpg",
        propertyLink: "properties/?location=Hinjewadi"
    },
    kharadi: {
        name: "Kharadi IT Corridor",
        tagline: "Eastern Pune's Tech Epicenter & World Trade Center Hub",
        avgPrice: "₹9,800 / sq.ft.",
        rentalYield: "5.2% p.a.",
        growthRate: "+16.1% (3-Yr)",
        highlights: [
            "Home to EON Free Zone, WTC Pune, and global corporate giants",
            "Direct connectivity to Pune International Airport (15 mins)",
            "Rapidly expanding riverside road network and commercial plazas",
            "High capital growth potential for executive corporate suites"
        ],
        image: "assets/images/obsidian-park-banner.jpg",
        propertyLink: "properties/?location=Kharadi"
    },
    balewadi: {
        name: "Balewadi High Street",
        tagline: "Pune's Lifestyle Landmark & High-End Urban Enclave",
        avgPrice: "₹10,500 / sq.ft.",
        rentalYield: "4.5% p.a.",
        growthRate: "+14.8% (3-Yr)",
        highlights: [
            "Famous Balewadi High Street dining, nightlife & luxury retail",
            "Shree Shiv Chhatrapati Sports Complex & international arenas",
            "Fastest exit to Baner, Aundh, and Mumbai Highway",
            "Prime location for flagship retail showrooms and penthouses"
        ],
        image: "assets/images/commercial-plaza-banner.jpg",
        propertyLink: "properties/?location=Balewadi"
    },
    wakad: {
        name: "Wakad Expressway Hub",
        tagline: "Well-Connected Residential Gateway with Booming Social Infra",
        avgPrice: "₹7,400 / sq.ft.",
        rentalYield: "5.4% p.a.",
        growthRate: "+17.0% (3-Yr)",
        highlights: [
            "Seamless bridge between Hinjewadi IT Park and Pimpri-Chinchwad",
            "Phoenix Marketcity Mall Wakad providing world-class retail",
            "Extensive educational institutions and multi-specialty healthcare",
            "Ideal for first-time luxury home buyers with great value"
        ],
        image: "assets/images/hero_bg_2.jpg",
        propertyLink: "properties/?location=Wakad"
    }
};

function initMarketExplorer() {
    const marketPills = document.querySelectorAll(".market-tab-pill");
    const nameEl = document.getElementById("marketAreaName");
    const tagEl = document.getElementById("marketAreaTag");
    const priceEl = document.getElementById("marketAvgPrice");
    const yieldEl = document.getElementById("marketRentalYield");
    const growthEl = document.getElementById("marketGrowthRate");
    const featuresList = document.getElementById("marketFeaturesList");
    const visualImg = document.getElementById("marketVisualImg");
    const visualTitle = document.getElementById("marketVisualTitle");
    const ctaBtn = document.getElementById("marketCtaBtn");

    if (!marketPills.length || !nameEl) return;

    function renderMarket(key) {
        const data = marketDatabase[key];
        if (!data) return;

        nameEl.textContent = data.name;
        tagEl.textContent = data.tagline;
        priceEl.textContent = data.avgPrice;
        yieldEl.textContent = data.rentalYield;
        growthEl.textContent = data.growthRate;

        if (featuresList) {
            featuresList.innerHTML = "";
            data.highlights.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${item}</span>`;
                featuresList.appendChild(li);
            });
        }

        if (visualImg) {
            visualImg.src = data.image;
        }
        if (visualTitle) {
            visualTitle.textContent = `${data.name} Real Estate Outlook`;
        }
        if (ctaBtn) {
            ctaBtn.href = data.propertyLink;
            ctaBtn.innerHTML = `Explore Properties in ${data.name} <i class="fa-solid fa-arrow-right-long"></i>`;
        }
    }

    marketPills.forEach(pill => {
        pill.addEventListener("click", () => {
            marketPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            const marketKey = pill.getAttribute("data-market") || "baner";
            renderMarket(marketKey);
        });
    });
}

/* --- 5. Interactive Home Loan EMI Calculator --- */
function initEmiCalculator() {
    const loanSlider = document.getElementById("loanAmountSlider");
    const rateSlider = document.getElementById("interestRateSlider");
    const tenureSlider = document.getElementById("tenureSlider");

    const loanValDisplay = document.getElementById("loanValDisplay");
    const rateValDisplay = document.getElementById("rateValDisplay");
    const tenureValDisplay = document.getElementById("tenureValDisplay");

    const emiAmountDisplay = document.getElementById("emiAmountDisplay");
    const totalPrincipalDisplay = document.getElementById("totalPrincipalDisplay");
    const totalInterestDisplay = document.getElementById("totalInterestDisplay");
    const totalPayableDisplay = document.getElementById("totalPayableDisplay");

    const principalRatioBar = document.getElementById("principalRatioBar");
    const interestRatioBar = document.getElementById("interestRatioBar");

    if (!loanSlider || !rateSlider || !tenureSlider || !emiAmountDisplay) return;

    function formatCurrencyVal(val) {
        if (currentCurrency === "INR") {
            return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
        } else if (currentCurrency === "USD") {
            const usd = Math.round(val * currencyRates.USD.rate);
            return `$${new Intl.NumberFormat("en-US").format(usd)}`;
        } else if (currentCurrency === "AED") {
            const aed = Math.round(val * currencyRates.AED.rate);
            return `AED ${new Intl.NumberFormat("en-US").format(aed)}`;
        }
        return `₹${val}`;
    }

    function formatSummaryVal(val) {
        if (currentCurrency === "INR") {
            if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
            return `₹${(val / 100000).toFixed(0)} Lakh`;
        } else if (currentCurrency === "USD") {
            const usd = Math.round(val * currencyRates.USD.rate);
            return `$${new Intl.NumberFormat("en-US").format(usd)}`;
        } else if (currentCurrency === "AED") {
            const aed = Math.round(val * currencyRates.AED.rate);
            return `AED ${new Intl.NumberFormat("en-US").format(aed)}`;
        }
        return `₹${val}`;
    }

    function calculateEMI() {
        const principal = parseFloat(loanSlider.value);
        const annualRate = parseFloat(rateSlider.value);
        const years = parseInt(tenureSlider.value, 10);

        // Update bubble displays
        loanValDisplay.textContent = formatSummaryVal(principal);
        rateValDisplay.textContent = `${annualRate.toFixed(1)}% p.a.`;
        tenureValDisplay.textContent = `${years} Years`;

        // Monthly calculations
        const monthlyRate = (annualRate / 12) / 100;
        const totalMonths = years * 12;

        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        const totalPayable = emi * totalMonths;
        const totalInterest = totalPayable - principal;

        // Render Outputs
        emiAmountDisplay.textContent = formatCurrencyVal(Math.round(emi));
        totalPrincipalDisplay.textContent = formatSummaryVal(principal);
        totalInterestDisplay.textContent = formatSummaryVal(Math.round(totalInterest));
        totalPayableDisplay.textContent = formatSummaryVal(Math.round(totalPayable));

        // Visual progress bar
        const principalPercent = (principal / totalPayable) * 100;
        const interestPercent = (totalInterest / totalPayable) * 100;

        if (principalRatioBar && interestRatioBar) {
            principalRatioBar.style.width = `${principalPercent.toFixed(1)}%`;
            interestRatioBar.style.width = `${interestPercent.toFixed(1)}%`;
        }
    }

    loanSlider.addEventListener("input", calculateEMI);
    rateSlider.addEventListener("input", calculateEMI);
    tenureSlider.addEventListener("input", calculateEMI);

    // Initial run
    calculateEMI();
}

/* --- 6. Interactive Floor Plan Blueprint Modal --- */
const floorPlanData = {
    "godrej-the-gale": {
        title: "Godrej The Gale - Floor Plan Blueprint",
        "2bhk": {
            type: "2 BHK Luxury Resort Residence",
            carpetArea: "785 Sq. Ft.",
            balconyArea: "95 Sq. Ft. Deck",
            loading: "32% Efficient",
            rooms: [
                { name: "Living & Dining", dims: "18'0\" x 11'6\"" },
                { name: "Master Bedroom", dims: "13'6\" x 11'0\"" },
                { name: "Children's Bedroom", dims: "11'0\" x 10'0\"" },
                { name: "Modular Kitchen", dims: "9'6\" x 8'0\"" },
                { name: "Panoramic Deck", dims: "11'6\" x 5'0\"" },
                { name: "Ensuite Bathroom", dims: "8'0\" x 5'0\"" }
            ]
        },
        "3bhk": {
            type: "3 BHK Grand Sky Suite",
            carpetArea: "1,120 Sq. Ft.",
            balconyArea: "140 Sq. Ft. Double Deck",
            loading: "30% Efficient",
            rooms: [
                { name: "Grand Living Room", dims: "22'0\" x 13'0\"" },
                { name: "Master Suite", dims: "15'0\" x 12'6\"" },
                { name: "Bedroom 2", dims: "12'6\" x 11'0\"" },
                { name: "Bedroom 3 / Study", dims: "11'0\" x 10'6\"" },
                { name: "Gourmet Kitchen", dims: "11'6\" x 9'0\"" },
                { name: "Sunset Deck", dims: "14'0\" x 6'0\"" }
            ]
        }
    },
    "vtp-skylight": {
        title: "VTP Skylight - Floor Plan Blueprint",
        "2bhk": {
            type: "3 BHK Premium Deck Apartment",
            carpetArea: "1,250 Sq. Ft.",
            balconyArea: "160 Sq. Ft. Wrap Deck",
            loading: "29% Efficient",
            rooms: [
                { name: "Palatial Living Hall", dims: "24'0\" x 14'0\"" },
                { name: "King Master Suite", dims: "16'0\" x 13'0\"" },
                { name: "Guest Bedroom", dims: "13'0\" x 12'0\"" },
                { name: "Kids Bedroom", dims: "12'0\" x 11'0\"" },
                { name: "Island Kitchen", dims: "12'0\" x 10'0\"" },
                { name: "Panoramic Terrace", dims: "16'0\" x 6'6\"" }
            ]
        },
        "3bhk": {
            type: "4 BHK Ultra-Luxury Penthouse",
            carpetArea: "1,780 Sq. Ft.",
            balconyArea: "220 Sq. Ft. Sky Garden",
            loading: "28% Efficient",
            rooms: [
                { name: "Double-Height Lounge", dims: "28'0\" x 16'0\"" },
                { name: "Presidential Master", dims: "18'0\" x 14'6\"" },
                { name: "Suite 2", dims: "14'6\" x 13'0\"" },
                { name: "Suite 3", dims: "14'0\" x 12'0\"" },
                { name: "Home Theatre / Study", dims: "13'0\" x 11'6\"" },
                { name: "Sky Terrace Garden", dims: "20'0\" x 8'0\"" }
            ]
        }
    },
    "prime-commercial-plaza": {
        title: "Prime Commercial Plaza - Blueprint",
        "2bhk": {
            type: "Retail Showroom Frontage",
            carpetArea: "850 Sq. Ft.",
            balconyArea: "Front Glass 24 Ft.",
            loading: "High Footfall",
            rooms: [
                { name: "Display Area", dims: "35'0\" x 20'0\"" },
                { name: "Billing Counter", dims: "10'0\" x 8'0\"" },
                { name: "Storage Pantry", dims: "12'0\" x 8'0\"" },
                { name: "Private Washroom", dims: "7'0\" x 5'0\"" },
                { name: "Highway Frontage", dims: "24'0\" Wide Glass" },
                { name: "Loading Bay Access", dims: "Direct Corridor" }
            ]
        },
        "3bhk": {
            type: "Grade-A Corporate Suite",
            carpetArea: "1,650 Sq. Ft.",
            balconyArea: "Private Terrace",
            loading: "100% Usable",
            rooms: [
                { name: "Open Workstation Hall", dims: "30'0\" x 24'0\"" },
                { name: "Executive Boardroom", dims: "16'0\" x 12'0\"" },
                { name: "Director Cabin", dims: "14'0\" x 12'0\"" },
                { name: "Server & Tech Room", dims: "9'0\" x 7'0\"" },
                { name: "Pantry & Lounge", dims: "14'0\" x 10'0\"" },
                { name: "Dual Restrooms", dims: "10'0\" x 6'0\"" }
            ]
        }
    }
};

function initBlueprintModal() {
    const modal = document.getElementById("blueprintModalOverlay");
    const closeBtn = document.getElementById("blueprintCloseBtn");
    const triggers = document.querySelectorAll(".trigger-blueprint");
    const titleEl = document.getElementById("blueprintModalTitle");
    const typeEl = document.getElementById("blueprintTypeTitle");
    const carpetEl = document.getElementById("blueprintCarpetVal");
    const balconyEl = document.getElementById("blueprintBalconyVal");
    const loadingEl = document.getElementById("blueprintLoadingVal");
    const roomsGrid = document.getElementById("blueprintRoomsGrid");
    const tabBtns = document.querySelectorAll(".blueprint-tab-btn");

    if (!modal) return;

    let activeProject = "godrej-the-gale";
    let activeConfig = "2bhk";

    function renderBlueprint() {
        const projData = floorPlanData[activeProject] || floorPlanData["godrej-the-gale"];
        const configData = projData[activeConfig];
        if (!configData) return;

        if (titleEl) titleEl.textContent = projData.title;
        if (typeEl) typeEl.textContent = configData.type;
        if (carpetEl) carpetEl.textContent = configData.carpetArea;
        if (balconyEl) balconyEl.textContent = configData.balconyArea;
        if (loadingEl) loadingEl.textContent = configData.loading;

        if (roomsGrid) {
            roomsGrid.innerHTML = "";
            configData.rooms.forEach(room => {
                const card = document.createElement("div");
                card.classList.add("blueprint-room-card");
                card.innerHTML = `<span>${room.name}</span><span>${room.dims}</span>`;
                roomsGrid.appendChild(card);
            });
        }
    }

    triggers.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            activeProject = btn.getAttribute("data-project") || "godrej-the-gale";
            activeConfig = "2bhk";

            tabBtns.forEach(t => {
                if (t.getAttribute("data-config") === "2bhk") t.classList.add("active");
                else t.classList.remove("active");
            });

            renderBlueprint();
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    tabBtns.forEach(tab => {
        tab.addEventListener("click", () => {
            tabBtns.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeConfig = tab.getAttribute("data-config") || "2bhk";
            renderBlueprint();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
}

/* --- 7. 3D Magnetic Card Tilt Interaction --- */
function initMagneticCardTilt() {
    // Only enable on desktop with mouse pointer (disable on touch screens for smoothness)
    if (window.matchMedia("(hover: none)").matches) return;

    const tiltCards = document.querySelectorAll(".tilt-card, .property-card");

    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6; // max 6 deg
            const rotateY = ((x - centerX) / centerX) * 6;  // max 6 deg

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}

/* --- 8. Floating WhatsApp Widget with Pre-filled Messages --- */
function initWhatsAppWidget() {
    const waWidgets = document.querySelectorAll("#whatsappWidget, .trigger-whatsapp-direct");
    const phoneNumber = "917218372145";

    waWidgets.forEach(widget => {
        widget.addEventListener("click", (e) => {
            e.preventDefault();
            const propName = widget.getAttribute("data-property") || "Pune Premium Properties";
            const message = `Hello 24K Realty, I would like to receive the updated brochure, floor plans, and exclusive pricing sheet for "${propName}". Please share details.`;
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
        });
    });
}

/* --- 9. Interactive Inquiry Modal Controller --- */
function initInquiryModal() {
    const modalOverlay = document.getElementById("inquiryModalOverlay");
    const closeBtn = document.getElementById("modalCloseBtn");
    const enquireButtons = document.querySelectorAll(".trigger-enquiry");
    const propertyTitleInput = document.getElementById("modalPropertyTitle");
    const modalSubtitle = document.getElementById("modalSubtitle");
    
    if (!modalOverlay) return;

    enquireButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const propertyName = btn.getAttribute("data-property") || "VIP Site Consultation";
            if (propertyTitleInput) propertyTitleInput.value = propertyName;
            if (modalSubtitle) modalSubtitle.textContent = `Consultation for: ${propertyName}`;
            
            modalOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    function closeModal() {
        modalOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

/* --- 10. Form Submission Validation & Feedback --- */
function initContactForms() {
    const contactForm = document.getElementById("contactForm");
    const modalForm = document.getElementById("modalForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateForm(contactForm)) {
                handleFormSubmission(contactForm);
            }
        });
    }

    if (modalForm) {
        modalForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (validateForm(modalForm)) {
                handleFormSubmission(modalForm);
            }
        });
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll("[required]");
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = "#EF4444";
            } else {
                input.style.borderColor = "#E2E8F0";
            }

            if (input.type === "tel" && input.value.trim()) {
                const phonePattern = /^\+?[0-9\s-]{10,14}$/;
                if (!phonePattern.test(input.value.trim())) {
                    isValid = false;
                    input.style.borderColor = "#EF4444";
                }
            }
        });
        return isValid;
    }

    function handleFormSubmission(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn ? submitBtn.textContent : "Submit";
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Scheduling VIP Visit...";
        }

        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        const selectProp = form.querySelector('select');
        const textareaMsg = form.querySelector('textarea');
        const hiddenProp = form.querySelector('input[type="hidden"]');
        
        const payload = {
            name: nameInput ? nameInput.value.trim() : "",
            email: emailInput ? emailInput.value.trim() : "",
            phone: phoneInput ? phoneInput.value.trim() : "",
            interest: selectProp ? selectProp.value.trim() : "",
            message: textareaMsg ? textareaMsg.value.trim() : "",
            property: hiddenProp ? hiddenProp.value.trim() : (document.getElementById("dynPropertyTitle") ? document.getElementById("dynPropertyTitle").textContent.trim() : "General Consultation"),
            formType: form.id === "modalForm" ? "Modal Inquiry" : "VIP Site Visit Request"
        };

        const finalizeSubmission = () => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
            showSuccessOverlay(form, form.id === "modalForm");
        };

        if (typeof GOOGLE_SCRIPT_URL !== "undefined" && GOOGLE_SCRIPT_URL) {
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(() => finalizeSubmission())
            .catch(err => {
                console.error("Submission error:", err);
                finalizeSubmission();
            });
        } else {
            setTimeout(finalizeSubmission, 1000);
        }
    }

    function showSuccessOverlay(form, isModal = false) {
        const overlay = form.closest(".glass-card, .contact-form-block, .inquiry-modal").querySelector(".form-success-overlay");
        if (overlay) {
            overlay.classList.add("show");
            setTimeout(() => {
                form.reset();
                overlay.classList.remove("show");
                if (isModal) {
                    const modalOverlay = document.getElementById("inquiryModalOverlay");
                    if (modalOverlay) {
                        modalOverlay.classList.remove("active");
                        document.body.style.overflow = "auto";
                    }
                }
            }, 3000);
        }
    }
}

/* --- 11. Tab Filtering for Properties Page --- */
function initPropertyFilters() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const propertyCards = document.querySelectorAll(".property-card, .property-grid-card");
    if (tabButtons.length === 0) return;

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filterValue = btn.getAttribute("data-filter");
            filterProperties(filterValue);
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const incomingType = urlParams.get("type");
    const incomingLocation = urlParams.get("location");
    
    if (incomingType || incomingLocation) {
        let matchedTab = incomingType || "all";
        const targetTab = Array.from(tabButtons).find(btn => btn.getAttribute("data-filter") === matchedTab);
        if (targetTab) {
            tabButtons.forEach(b => b.classList.remove("active"));
            targetTab.classList.add("active");
            filterProperties(matchedTab, incomingLocation);
        }
    }

    function filterProperties(category, locationQuery = "") {
        propertyCards.forEach(card => {
            const cardType = card.getAttribute("data-type") || "all";
            const cardLocation = (card.getAttribute("data-location") || "").toLowerCase();
            
            const matchesCategory = (category === "all" || cardType === category);
            const matchesLocation = (!locationQuery || cardLocation.includes(locationQuery.toLowerCase()));

            if (matchesCategory && matchesLocation) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
    }
}

/* --- 12. Dynamic Single Property Details Router --- */
const propertiesDatabase = {
    "godrej-the-gale": {
        title: "Godrej The Gale",
        location: "Hinjewadi Phase 1, Pune",
        price: "Starting at ₹85 Lakh*",
        rera: "P52100052309 (RERA Verified)",
        type: "Luxury Residential Apartments",
        configurations: "2 & 3 BHK Premium Residences",
        area: "750 - 1100 Sq. Ft.",
        status: "New Launch (Site visits open)",
        description: "Godrej The Gale brings modern resort-lifestyle living to Hinjewadi, Pune's premier IT hub. Featuring pristine green reserves, sky terraces, infinity pools, and round-the-clock concierge, every residence guarantees the 24K gold standard of urban comfort and investment yield.",
        amenities: ["Rooftop Infinity Pool", "24/7 Smart Security", "Grand Clubhouse", "Sky Walking Track", "Co-working Lounge", "Indoor Badminton Court"],
        image: "assets/images/godrej-gale-banner.jpg",
        fallbackImg: "assets/images/hero_daylight.jpg"
    },
    "vtp-skylight": {
        title: "VTP Skylight",
        location: "Baner Annex, Pune",
        price: "Starting at ₹84 Lakh*",
        rera: "P52100048123 (RERA Verified)",
        type: "Luxury High-Rise Complex",
        configurations: "3 & 4 BHK Panoramic Apartments",
        area: "1250 - 1800 Sq. Ft.",
        status: "Under Construction",
        description: "VTP Skylight redefines Pune's western skyline with expansive private deck terraces, imported Italian marble finishes, automated smart home controls, and uninterrupted hill views. Secured with 24K Realty's guaranteed price assurance.",
        amenities: ["Panoramic Private Decks", "Home Automation", "Olympic-size Pool", "Exclusive Health Spa", "Private Mini Theatre", "Jogging Tracks"],
        image: "assets/images/millennium-falcon-banner.jpg",
        fallbackImg: "assets/images/penthouse_daylight.jpg"
    },
    "prime-commercial-plaza": {
        title: "Prime Commercial Plaza",
        location: "Baner Highway, Pune",
        price: "Starting at ₹1.20 Cr*",
        rera: "P52100034988 (Commercial Standard)",
        type: "High-Visibility Commercial",
        configurations: "Retail Showrooms & Corporate Suites",
        area: "450 - 2500 Sq. Ft.",
        status: "Ready to Move",
        description: "High-visibility retail showrooms and modern Grade-A office suites positioned directly along the Baner-Mumbai highway stretch. Maximum footfall, extensive glass facade, high rental yield, and immediate possession.",
        amenities: ["Dual Escalators", "High-Speed Elevators", "100% Power Backup", "Multi-Level Car Parking", "24/7 Access Control", "Central Air Conditioning"],
        image: "assets/images/commercial-plaza-banner.jpg",
        fallbackImg: "assets/images/hero_daylight.jpg"
    },
    "obsidian-business-park": {
        title: "Obsidian Business Park",
        location: "Kharadi IT Zone, Pune",
        price: "Starting at ₹1.20 Cr*",
        rera: "P52100029811 (RERA Approved)",
        type: "Corporate Tech Park",
        configurations: "Executive Corporate Suites",
        area: "800 - 3200 Sq. Ft.",
        status: "New Launch",
        description: "Futuristic corporate workspace architectures inside Pune's thriving eastern tech hub. Custom acoustic layouts, high-speed fiber connectivity, panoramic boardroom terraces, and electric charging bays.",
        amenities: ["Fiber Optic Ready", "Double Height Lobby", "Executive Boardrooms", "Rooftop Cafeteria", "Electric Charging Bays", "Fully Integrated HVAC"],
        image: "assets/images/obsidian-park-banner.jpg",
        fallbackImg: "assets/images/hero_daylight.jpg"
    }
};

function initPropertyDetailsRouter() {
    const pageTitle = document.getElementById("dynPropertyTitle");
    if (!pageTitle) return;

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("project") || "godrej-the-gale";
    const project = propertiesDatabase[projectId];

    if (!project) return;

    pageTitle.textContent = project.title;
    const heroTitle = document.getElementById("dynPropertyTitleHero");
    if (heroTitle) heroTitle.textContent = project.title;
    
    if (document.getElementById("dynPropertyType")) document.getElementById("dynPropertyType").textContent = project.type;
    if (document.getElementById("dynPropertyPrice")) document.getElementById("dynPropertyPrice").textContent = project.price;
    if (document.getElementById("dynPropertyRera")) document.getElementById("dynPropertyRera").textContent = project.rera;
    if (document.getElementById("dynPropertyAddress")) document.getElementById("dynPropertyAddress").textContent = project.location;
    if (document.getElementById("dynPropertyDesc")) document.getElementById("dynPropertyDesc").textContent = project.description;
    
    const nameEl = document.getElementById("dynPropertyName");
    if (nameEl) nameEl.textContent = project.title;

    if (document.getElementById("dynSpecType")) document.getElementById("dynSpecType").textContent = project.type;
    if (document.getElementById("dynSpecConfig")) document.getElementById("dynSpecConfig").textContent = project.configurations;
    if (document.getElementById("dynSpecArea")) document.getElementById("dynSpecArea").textContent = project.area;
    if (document.getElementById("dynSpecStatus")) document.getElementById("dynSpecStatus").textContent = project.status;
    if (document.getElementById("dynSpecPrice")) document.getElementById("dynSpecPrice").textContent = project.price;
    if (document.getElementById("dynSpecRera")) document.getElementById("dynSpecRera").textContent = project.rera;

    const enquireBtn = document.getElementById("dynEnquiryTrigger");
    if (enquireBtn) enquireBtn.setAttribute("data-property", project.title);

    const amenitiesList = document.getElementById("dynAmenitiesList");
    if (amenitiesList) {
        amenitiesList.innerHTML = "";
        project.amenities.forEach(amenity => {
            const item = document.createElement("div");
            item.classList.add("amenity-item");
            item.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${amenity}</span>`;
            amenitiesList.appendChild(item);
        });
    }

    const galleryImg = document.getElementById("dynGalleryImg");
    if (galleryImg) {
        galleryImg.src = project.image;
        galleryImg.onerror = () => { galleryImg.src = project.fallbackImg; };
    }
}

/* --- 13. Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    revealEls.forEach(el => observer.observe(el));
}

/* --- 14. Animated Number Counters --- */
function initCounterAnimation() {
    const counters = document.querySelectorAll(".stat-counter");
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute("data-target") || el.textContent, 10);
                const suffix = el.getAttribute("data-suffix") || "";
                
                if (isNaN(target)) return;

                const duration = 2000;
                const start = performance.now();

                function updateCount(timestamp) {
                    const elapsed = timestamp - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target) + suffix;
                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        el.textContent = target + suffix;
                    }
                }
                requestAnimationFrame(updateCount);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => {
        const raw = el.textContent.replace(/[^0-9]/g, "");
        const suffix = el.textContent.replace(/[0-9]/g, "");
        el.setAttribute("data-target", raw);
        el.setAttribute("data-suffix", suffix);
        observer.observe(el);
    });
}
