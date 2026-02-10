/**
 * MITSUKI RAMADAN EXPERIENCE - JAVASCRIPT
 * Handles countdown timer, order form, and interactions
 */

// ===== STATE MANAGEMENT =====
let selectedPack = null;
let selectedPackPrice = 0;
let addonsTotal = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initCountdownTimer();
    initMobileMenu();
    initOrderForm();
    initAddons();
    initSmoothScroll();
    initNavbarScroll();
    setMinDeliveryDate();
});

// ===== COUNTDOWN TIMER =====
function initCountdownTimer() {
    // Calculate time until 4 PM (16:00) - order cutoff for same-day delivery
    function updateCountdown() {
        const now = new Date();
        let target = new Date();
        
        // Set target to 4 PM today
        target.setHours(16, 0, 0, 0);
        
        // If it's past 4 PM, set target to 4 PM tomorrow
        if (now >= target) {
            target.setDate(target.getDate() + 1);
        }
        
        const diff = target - now;
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking a link
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== SET MINIMUM DELIVERY DATE =====
function setMinDeliveryDate() {
    const dateInput = document.getElementById('delivery-date');
    if (dateInput) {
        const now = new Date();
        
        // If it's past 4 PM, minimum date is tomorrow
        if (now.getHours() >= 16) {
            now.setDate(now.getDate() + 1);
        }
        
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        
        dateInput.min = `${year}-${month}-${day}`;
        dateInput.value = `${year}-${month}-${day}`;
    }
}

// ===== PACK SELECTION =====
function selectPack(packId, price) {
    selectedPack = packId;
    selectedPackPrice = price;
    
    // Update UI
    const packDisplay = document.getElementById('selected-pack-display');
    const packNameEl = document.getElementById('selected-pack-name');
    const packPriceEl = document.getElementById('selected-pack-price');
    const packSelection = document.getElementById('pack-selection');
    
    // Format pack name
    const packNames = {
        'solo-zen': 'The Solo Zen',
        'duo-harmony': 'The Duo Harmony',
        'imperial-feast': 'The Imperial Feast'
    };
    
    if (packDisplay && packNameEl && packPriceEl) {
        packNameEl.textContent = packNames[packId] || packId;
        packPriceEl.textContent = price;
        packDisplay.classList.remove('hidden');
    }
    
    // Highlight selected pack in pack selection
    const packOptions = document.querySelectorAll('.pack-option');
    packOptions.forEach(option => {
        option.classList.remove('selected');
    });
    
    // Find and highlight the selected option
    packOptions.forEach(option => {
        if (option.onclick && option.onclick.toString().includes(packId)) {
            option.classList.add('selected');
        }
    });
    
    // Update total
    updateTotal();
    
    // Scroll to order form
    const orderSection = document.getElementById('order');
    if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== ADD-ONS =====
function initAddons() {
    const addonOptions = document.querySelectorAll('.addon-option');
    
    addonOptions.forEach(option => {
        option.addEventListener('click', function() {
            const checkbox = this.querySelector('.addon-checkbox');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                updateTotal();
            }
        });
    });
}

// ===== UPDATE TOTAL =====
function updateTotal() {
    let total = selectedPackPrice;
    
    // Add addons
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox:checked');
    addonCheckboxes.forEach(checkbox => {
        total += parseInt(checkbox.dataset.price) || 0;
    });
    
    // Update display
    const totalEl = document.getElementById('total-price');
    if (totalEl) {
        totalEl.textContent = total;
    }
}

// ===== ORDER FORM =====
function initOrderForm() {
    const form = document.getElementById('order-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate pack selection
            if (!selectedPack) {
                alert('Veuillez sélectionner un pack avant de commander.');
                return;
            }
            
            // Get form data
            const formData = {
                pack: selectedPack,
                packPrice: selectedPackPrice,
                date: document.getElementById('delivery-date').value,
                time: document.getElementById('delivery-time').value,
                name: document.getElementById('customer-name').value,
                phone: document.getElementById('customer-phone').value,
                address: document.getElementById('customer-address').value,
                addons: getSelectedAddons(),
                total: document.getElementById('total-price').textContent
            };
            
            // Log order (in production, send to backend)
            console.log('Order submitted:', formData);
            
            // Show success modal
            showOrderModal();
            
            // Reset form
            form.reset();
            selectedPack = null;
            selectedPackPrice = 0;
            document.getElementById('selected-pack-display').classList.add('hidden');
            document.getElementById('total-price').textContent = '0';
            document.querySelectorAll('.pack-option').forEach(opt => opt.classList.remove('selected'));
            setMinDeliveryDate();
        });
    }
}

// ===== GET SELECTED ADDONS =====
function getSelectedAddons() {
    const addons = [];
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox:checked');
    
    addonCheckboxes.forEach(checkbox => {
        addons.push({
            name: checkbox.dataset.name,
            price: parseInt(checkbox.dataset.price)
        });
    });
    
    return addons;
}

// ===== ORDER MODAL =====
function showOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate in
        setTimeout(() => {
            const content = document.getElementById('modal-content');
            if (content) {
                content.style.transform = 'scale(1)';
                content.style.opacity = '1';
            }
        }, 100);
    }
}

function closeModal() {
    const modal = document.getElementById('order-modal');
    const content = document.getElementById('modal-content');
    
    if (content) {
        content.style.transform = 'scale(0.95)';
        content.style.opacity = '0';
    }
    
    setTimeout(() => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 300);
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('order-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});
