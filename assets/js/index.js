document.addEventListener('DOMContentLoaded', () => {

    /* --- COUNTDOWN LOGIC --- */
    function updateTimer() {
        const now = new Date();
        const deadline = new Date();
        // Set deadline to 4:00 PM (16:00) today
        deadline.setHours(16, 0, 0, 0);

        // If it's already past 4 PM, set deadline to tomorrow 4 PM
        if (now > deadline) {
            deadline.setDate(deadline.getDate() + 1);
        }

        const diff = deadline - now;

        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const formattedTime =
            (hours < 10 ? "0" + hours : hours) + "h " +
            (minutes < 10 ? "0" + minutes : minutes) + "m " +
            (seconds < 10 ? "0" + seconds : seconds) + "s";

        document.getElementById('top-timer').innerText = formattedTime;
        document.getElementById('sticky-timer').innerText =
            (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);
    }
    setInterval(updateTimer, 1000);
    updateTimer(); // Run immediately

    /* --- CHECKOUT LOGIC --- */
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    const waitingPage = document.getElementById('waiting-page');
    const wpName = document.getElementById('wp-product-name');
    const wpPrice = document.getElementById('wp-product-price');
    const manualBtn = document.getElementById('manual-redirect-btn');
    const closeBtn = document.getElementById('close-popup-btn'); // New Close Button
    const whatsappNumber = "212600000000";

    /* --- CLOSE POPUP LOGIC --- */
    function closePopup() {
        waitingPage.classList.add('hidden');
        waitingPage.classList.remove('flex');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }

    // Close on click outside
    waitingPage.addEventListener('click', (e) => {
        if (e.target === waitingPage) {
            closePopup();
        }
    });

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.getAttribute('data-product-title');
            const price = card.getAttribute('data-product-price');

            // Show popup
            waitingPage.classList.remove('hidden');
            waitingPage.classList.add('flex');

            wpName.textContent = title;
            wpPrice.textContent = price + " DH";

            const message = `Salam Mitsuki. Je souhaite commander : ${title} (${price} DH).`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            manualBtn.onclick = () => window.location.href = whatsappUrl;
        });
    });
});