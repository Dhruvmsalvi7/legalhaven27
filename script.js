const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealEls = document.querySelectorAll('.reveal');
const yearEl = document.getElementById('year');
const form = document.querySelector('.contact-form');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${Math.min(index * 70, 250)}ms`;
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in-view'));
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = 'Request Sent';
      submitButton.disabled = true;
    }

    if (!form.querySelector('.submit-note')) {
      const note = document.createElement('p');
      note.className = 'form-note submit-note';
      note.textContent = 'Thank you. Our team will contact you shortly.';
      form.appendChild(note);
    }
  });
}
