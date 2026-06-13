/* -------------------------------------------------------------
   24K Realty JavaScript Controller
   Pure JS (No jQuery, No PHP, Client-Side Router)
   ------------------------------------------------------------- */

// Configuration: Google Apps Script Web App URL
// Paste your deployed Web App URL (ending with /exec) here:
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby1ce_nwOaFY0lTrZTqrz6g4lUMHSLXjwrB3xAloYIemsyfh2oRlTyUfXIMf04X_ucv/exec";

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
    initHeroSlider();
    initTestimonialSlider();
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
        if (window.scrollY > 50) {
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
        mobileDrawer.classList.remove("open");
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

/* --- 2. Hero Slideshow/Slider --- */
function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    const nextBtn = document.getElementById("heroNext");
    const prevBtn = document.getElementById("heroPrev");
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 6000);

    function showSlide(index) {
        slides[currentSlide].classList.remove("active");
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetTimer();
        });
    }

    function resetTimer() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
    }
}

/* --- 3. Testimonial Quotes Carousel --- */
function initTestimonialSlider() {
    const cards = document.querySelectorAll(".testimonial-slide-card");
    const dotsContainer = document.getElementById("testimonialDots");
    if (cards.length === 0) return;

    let currentIndex = 0;
    let interval = setInterval(nextTestimonial, 5000);

    // Create dots dynamically
    if (dotsContainer) {
        dotsContainer.innerHTML = "";
        cards.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.classList.add("testimonial-dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => {
                showTestimonial(index);
                resetTimer();
            });
            dotsContainer.appendChild(dot);
        });
    }

    function showTestimonial(index) {
        cards[currentIndex].classList.remove("active");
        
        const dots = document.querySelectorAll(".testimonial-dot");
        if (dots.length > 0) dots[currentIndex].classList.remove("active");
        
        currentIndex = (index + cards.length) % cards.length;
        
        cards[currentIndex].classList.add("active");
        if (dots.length > 0) dots[currentIndex].classList.add("active");
    }

    function nextTestimonial() {
        showTestimonial(currentIndex + 1);
    }

    function resetTimer() {
        clearInterval(interval);
        interval = setInterval(nextTestimonial, 5000);
    }
}

/* --- 4. Floating WhatsApp Widget --- */
function initWhatsAppWidget() {
    const waWidget = document.getElementById("whatsappWidget");
    if (!waWidget) return;

    const phoneNumber = "919876543210"; // Custom WhatsApp Number
    const message = "Hi 24K Realty, I am interested in booking a consultation for your premium residential/commercial spaces. Please guide me.";

    waWidget.addEventListener("click", (e) => {
        e.preventDefault();
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    });
}

/* --- 5. Interactive Modal Controller --- */
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
            const propertyName = btn.getAttribute("data-property") || "General Consultation";
            if (propertyTitleInput) propertyTitleInput.value = propertyName;
            if (modalSubtitle) modalSubtitle.textContent = `Enquiry for: ${propertyName}`;
            
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

/* --- 6. Form Submission Validation & Feedback --- */
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
                input.style.borderColor = "#ff4d4d";
            } else {
                input.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }

            // Simple phone checks
            if (input.type === "tel" && input.value.trim()) {
                const phonePattern = /^\+?[0-9\s-]{10,14}$/;
                if (!phonePattern.test(input.value.trim())) {
                    isValid = false;
                    input.style.borderColor = "#ff4d4d";
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
            submitBtn.textContent = "Submitting...";
        }

        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInput = form.querySelector('input[type="tel"]');
        const selectSelect = form.querySelector('select');
        const textareaMsg = form.querySelector('textarea');
        const hiddenProp = form.querySelector('input[type="hidden"]');
        
        const payload = {
            name: nameInput ? nameInput.value.trim() : "",
            email: emailInput ? emailInput.value.trim() : "",
            phone: phoneInput ? phoneInput.value.trim() : "",
            preferredDay: selectSelect ? selectSelect.value.trim() : "",
            message: textareaMsg ? textareaMsg.value.trim() : "",
            property: hiddenProp ? hiddenProp.value.trim() : (document.getElementById("dynPropertyTitle") ? document.getElementById("dynPropertyTitle").textContent.trim() : "General Consultation"),
            formType: form.id === "modalForm" ? "Modal Inquiry" : (submitBtn && submitBtn.textContent.toLowerCase().includes("visit") ? "Site Visit Request" : "Free Consultation")
        };

        const finalizeSubmission = () => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
            showSuccessOverlay(form, form.id === "modalForm");
        };

        if (typeof GOOGLE_SCRIPT_URL !== "undefined" && GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "YOUR_DEPLOYED_WEB_APP_URL") {
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(() => {
                finalizeSubmission();
            })
            .catch(err => {
                console.error("Error submitting to Google Sheet:", err);
                finalizeSubmission();
            });
        } else {
            console.warn("Google Sheet Apps Script Web App URL is not set. Please deploy your Google Apps Script and paste the URL in GOOGLE_SCRIPT_URL inside assets/js/main.js.");
            setTimeout(finalizeSubmission, 1000); // Simulate network delay for UX feedback
        }
    }

    function showSuccessOverlay(form, isModal = false) {
        const overlay = form.closest(".glass-card, .inquiry-modal").querySelector(".form-success-overlay");
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

/* --- 7. Search Panel & Properties Filters --- */
function initPropertyFilters() {
    const searchBtn = document.getElementById("filterSearchBtn");
    
    // Quick search from homepage redirects to properties.html with params
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const type = document.getElementById("searchType").value;
            const location = document.getElementById("searchLocation").value;
            window.location.href = `properties.html?type=${encodeURIComponent(type)}&location=${encodeURIComponent(location)}`;
        });
    }

    // Tab filtering on properties.html
    const tabButtons = document.querySelectorAll(".tab-btn");
    const propertyCards = document.querySelectorAll(".property-grid-card");
    if (tabButtons.length === 0) return;

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filterValue = btn.getAttribute("data-filter");
            filterProperties(filterValue);
        });
    });

    // Check URL parameters for custom incoming filters
    const urlParams = new URLSearchParams(window.location.search);
    const incomingType = urlParams.get("type");
    const incomingLocation = urlParams.get("location");
    
    if (incomingType || incomingLocation) {
        let matchedTab = "all";
        if (incomingType === "residential") matchedTab = "residential";
        if (incomingType === "commercial") matchedTab = "commercial";
        if (incomingType === "resale") matchedTab = "resale";

        const targetTab = Array.from(tabButtons).find(btn => btn.getAttribute("data-filter") === matchedTab);
        if (targetTab) {
            tabButtons.forEach(b => b.classList.remove("active"));
            targetTab.classList.add("active");
            filterProperties(matchedTab, incomingLocation);
        }
    }

    function filterProperties(category, locationQuery = "") {
        propertyCards.forEach(card => {
            const cardType = card.getAttribute("data-type");
            const cardLocation = card.getAttribute("data-location").toLowerCase();
            
            const matchesCategory = (category === "all" || cardType === category);
            const matchesLocation = (!locationQuery || cardLocation.includes(locationQuery.toLowerCase()));

            if (matchesCategory && matchesLocation) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }
}

/* --- 8. Dynamic Client-Side Property Details Router --- */
// Holds our static property data configurations
const propertiesDatabase = {
    "godrej-the-gale": {
        title: "Godrej The Gale",
        location: "Kharadi, Pune",
        price: "Starting at ₹85 Lakh*",
        rera: "P52100052309 (Available at site)",
        type: "Residential Flat / Apartment",
        configurations: "2 & 3 BHK Premium Residences",
        area: "750 - 1100 Sq. Ft.",
        status: "New Launch (Site visits available)",
        description: "Godrej The Gale brings a modern resort-lifestyle design to Kharadi, one of Pune's fastest-growing IT and residential hotspots. Featuring pristine green reserves, premium structural designs, and state-of-the-art health clubs, every apartment guarantees gold-standard living and structural safety. Benefit from end-to-end guidance and verified legal titles with 24K Realty.",
        amenities: ["Rooftop Infinity Pool", "24/7 Smart Security", "Premium Clubhouse", "Landscaped Gardens", "Co-working Space", "Indoor Games Area"],
        image: "assets/images/godrej-gale-banner.jpg",
        fallbackImg: "assets/images/hero_bg_1.jpg"
    },
    "millennium-falcon": {
        title: "Millennium Falcon",
        location: "Wagholi, Pune",
        price: "Starting at ₹92 Lakh*",
        rera: "P52100048123 (Verified Project)",
        type: "Luxury Residential Complex",
        configurations: "3 & 4 BHK Luxury Apartments",
        area: "1250 - 1800 Sq. Ft.",
        status: "Under Construction",
        description: "Millennium Falcon represents the peak of high-rise luxury flat design in Wagholi. Featuring large panoramic deck terraces, high-end marble bath finishes, automated lighting controls, and visual luxury themes, it provides the perfect escape from the city hustle. Invest with 24K Realty for exclusive booking rates and assured site visits.",
        amenities: ["Panoramic Private Decks", "Home Automation", "Olympic-size Pool", "Exclusive Health Spa", "Private Mini Theatre", "Jogging Tracks"],
        image: "assets/images/millennium-falcon-banner.jpg",
        fallbackImg: "assets/images/hero_bg_2.jpg"
    },
    "prime-commercial-plaza": {
        title: "Prime Commercial Plaza",
        location: "Kharadi-Wagholi Road, Pune",
        price: "Starting at ₹1.5 Cr*",
        rera: "P52100034988 (RERA Approved)",
        type: "Premium Commercial Spaces",
        configurations: "High-Visibility Showrooms & Offices",
        area: "450 - 2500 Sq. Ft.",
        status: "Ready to Move",
        description: "Elevate your corporate brand at Pune's high-visibility business address. Perfectly situated with extensive glass frontage along the prime highway road, this complex is tailored for showrooms, luxury retail brand outlets, and corporate headquarters. Benefit from data-driven investment advisory to secure top rental yield appreciation.",
        amenities: ["Dual Escalators", "High-Speed Elevators", "100% Power Backup", "Multi-Level Car Parking", "24/7 Access Control", "Central Air Conditioning"],
        image: "assets/images/commercial-plaza-banner.jpg",
        fallbackImg: "assets/images/hero_bg_3.jpg"
    },
    "obsidian-business-park": {
        title: "Obsidian Business Park",
        location: "Kharadi IT Zone, Pune",
        price: "Starting at ₹1.2 Cr*",
        rera: "P52100029811 (Commercial Standard)",
        type: "Modern Office Spaces",
        configurations: "Executive Corporate Suites",
        area: "800 - 3200 Sq. Ft.",
        status: "New Launch",
        description: "Obsidian Business Park features futuristic workspace architectural designs inside the high-growth IT corridors of Pune. Custom layouts, fiber connectivity, glass boardrooms, and lounge terraces provide a highly inspiring atmosphere for tech scale-ups and established corporations alike.",
        amenities: ["Fiber Optic Ready", "Double Height Lobby", "Executive Boardrooms", "Rooftop Cafeteria", "Electric Charging Bays", "Fully Integrated HVAC"],
        image: "assets/images/obsidian-park-banner.jpg",
        fallbackImg: "assets/images/hero_bg_2.jpg"
    }
};

function initPropertyDetailsRouter() {
    const pageTitle = document.getElementById("dynPropertyTitle");
    if (!pageTitle) return; // Exit if not on property-single.html

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get("project") || "godrej-the-gale"; // Default project
    const project = propertiesDatabase[projectId];

    if (!project) {
        // Fallback title
        pageTitle.textContent = "Property Details";
        return;
    }

    // Dynamic rendering of fields
    pageTitle.textContent = project.title;
    document.getElementById("dynPropertyTitleHero").textContent = project.title;
    document.getElementById("dynPropertyType").textContent = project.type;
    document.getElementById("dynPropertyPrice").textContent = project.price;
    document.getElementById("dynPropertyRera").textContent = project.rera;
    document.getElementById("dynPropertyAddress").textContent = project.location;
    document.getElementById("dynPropertyDesc").textContent = project.description;
    
    // Property Name (h2)
    const nameEl = document.getElementById("dynPropertyName");
    if (nameEl) nameEl.textContent = project.title;

    // Config details
    document.getElementById("dynSpecType").textContent = project.type;
    document.getElementById("dynSpecConfig").textContent = project.configurations;
    document.getElementById("dynSpecArea").textContent = project.area;
    document.getElementById("dynSpecStatus").textContent = project.status;
    document.getElementById("dynSpecPrice").textContent = project.price;
    document.getElementById("dynSpecRera").textContent = project.rera;

    // Trigger button properties
    const enquireBtn = document.getElementById("dynEnquiryTrigger");
    if (enquireBtn) {
        enquireBtn.setAttribute("data-property", project.title);
    }

    // Amenities rendering
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

    // Image gallery background/fallback
    const heroSection = document.querySelector(".inner-hero");
    if (heroSection) {
        heroSection.style.backgroundImage = `url('${project.image}')`;
        
        // Handle image loading error (fallback to local architectural pattern)
        const imgObj = new Image();
        imgObj.src = project.image;
        imgObj.onerror = () => {
            heroSection.style.backgroundImage = `url('${project.fallbackImg}')`;
        };
    }
    
    const galleryImg = document.getElementById("dynGalleryImg");
    if (galleryImg) {
        galleryImg.src = project.image;
        galleryImg.onerror = () => {
            galleryImg.src = project.fallbackImg;
        };
    }
}

/* --- 9. Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Only fire once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealEls.forEach(el => observer.observe(el));

    // Also observe stagger containers - reveal children individually
    const staggerContainers = document.querySelectorAll(".reveal-stagger");
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, i) => {
            child.classList.add("reveal");
            child.style.transitionDelay = `${i * 0.1}s`;
            observer.observe(child);
        });
    });
}

/* --- 10. Animated Counter Numbers --- */
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
                    // Ease out quad
                    const eased = 1 - (1 - progress) * (1 - progress);
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

