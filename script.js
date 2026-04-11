const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
const revealEls = document.querySelectorAll('.reveal');
const yearEl = document.getElementById('year');
const forms = document.querySelectorAll('.contact-form');
const teamPhotoTriggers = document.querySelectorAll('.team-photo-trigger');

const contactRecipients = [
  'vianicavillarin@gmail.com',
  'dhruvmsalvi@gmail.com'
];

const toTitleCase = (value) =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const buildContactMailto = (formEl) => {
  const formData = new FormData(formEl);
  const details = [];

  formData.forEach((value, key) => {
    const cleanedValue = String(value).trim();
    if (!cleanedValue) {
      return;
    }

    const label = toTitleCase(key.replace(/[-_]+/g, ' '));
    details.push(`${label}: ${cleanedValue}`);
  });

  const subject = encodeURIComponent('LegalHaven contact request');
  const body = encodeURIComponent(
    `Hello LegalHaven team,\n\nPlease see my contact request details below:\n\n${details.join('\n')}\n`
  );

  return `mailto:${contactRecipients.join(',')}?subject=${subject}&body=${body}`;
};

const closeTeamSocialTabs = (exceptCard = null) => {
  const openCards = document.querySelectorAll('.team-card.social-open');
  openCards.forEach((card) => {
    if (exceptCard && card === exceptCard) {
      return;
    }

    card.classList.remove('social-open');
    const trigger = card.querySelector('.team-photo-trigger');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
};

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

if (dropdownTriggers.length > 0) {
  dropdownTriggers.forEach((trigger) => {
    const dropdown = trigger.closest('.nav-dropdown');
    if (!dropdown) {
      return;
    }

    trigger.addEventListener('click', () => {
      const isOpen = dropdown.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });
  });

  document.addEventListener('click', (event) => {
    dropdownTriggers.forEach((trigger) => {
      const dropdown = trigger.closest('.nav-dropdown');
      if (!dropdown) {
        return;
      }

      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    dropdownTriggers.forEach((trigger) => {
      const dropdown = trigger.closest('.nav-dropdown');
      if (!dropdown) {
        return;
      }

      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
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

if (forms.length > 0) {
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      window.location.href = buildContactMailto(form);

      if (!form.querySelector('.submit-note')) {
        const note = document.createElement('p');
        note.className = 'form-note submit-note';
        note.textContent = 'Your email app should open with your message prefilled.';
        form.appendChild(note);
      }
    });
  });
}

if (teamPhotoTriggers.length > 0) {
  teamPhotoTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest('.team-card');
      if (!card) {
        return;
      }

      const willOpen = !card.classList.contains('social-open');
      closeTeamSocialTabs(card);

      card.classList.toggle('social-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });

  document.addEventListener('click', (event) => {
    const clickedInsideTeamCard = event.target.closest('.team-card');
    if (!clickedInsideTeamCard) {
      closeTeamSocialTabs();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeTeamSocialTabs();
    }
  });
}
