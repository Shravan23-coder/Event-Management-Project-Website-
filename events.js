/* ============================================
   LUMINAE EVENTS — EVENTS FILTER
   js/events.js
============================================ */

const filterBtns   = document.querySelectorAll('.filter-btn');
const eventCards   = document.querySelectorAll('.event-card');
const eventsEmpty  = document.getElementById('eventsEmpty');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    eventCards.forEach((card, i) => {
      const category = card.dataset.category;
      const matches  = filter === 'all' || category === filter;

      if (matches) {
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, 10);
        visibleCount++;
      } else {
        card.style.opacity    = '0';
        card.style.transform  = 'translateY(-10px)';
        setTimeout(() => { card.style.display = 'none'; }, 350);
      }
    });

    // Show/hide empty state
    setTimeout(() => {
      if (eventsEmpty) {
        eventsEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }, 400);
  });
});
