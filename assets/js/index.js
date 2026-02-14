document.addEventListener('DOMContentLoaded', () => {

    /* --- ACCORDION LOGIC FOR PACKS --- */
    const toggles = document.querySelectorAll('.toggle-details-btn');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Prevent triggering if clicking the checkout button (though it's in details, just in case)
            e.stopPropagation();

            const card = toggle.closest('.product-card');
            const details = card.querySelector('.details-content');
            const arrow = card.querySelector('.arrow-icon svg');

            const isOpen = details.style.maxHeight && details.style.maxHeight !== '0px';

            // Close ALL cards first
            document.querySelectorAll('.product-card').forEach(c => {
                const d = c.querySelector('.details-content');
                const a = c.querySelector('.arrow-icon svg');

                if (d) {
                    d.style.maxHeight = '0px';
                    d.style.opacity = '0';
                }
                if (a) {
                    a.style.transform = 'rotate(0deg)';
                }
            });

            // If it wasn't open, open it now
            if (!isOpen) {
                details.style.maxHeight = details.scrollHeight + "px";
                details.style.opacity = '1';
                arrow.style.transform = 'rotate(180deg)';
            }
        });
    });

});