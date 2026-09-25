/* =========================================================
   SAKSHI THAWRE — DATA SCIENCE PORTFOLIO SCRIPTS
   Shared by every page. Each function does one clear job.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initStickyNavbar();
  initMobileMenu();
  initScrollReveal();
  initContactForm();
});

/**
 * Gives the navbar a background once the page is scrolled,
 * so it stays readable over both dark and light page content.
 */
function initStickyNavbar() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbarState() {
    if (window.scrollY > 20) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  }

  updateNavbarState();
  window.addEventListener('scroll', updateNavbarState);
}

/**
 * Opens/closes the mobile navigation menu, and closes it again
 * automatically once a link inside it is clicked.
 */
function initMobileMenu() {
  var toggleBtn = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', function () {
    var isOpen = navMenu.classList.toggle('is-open');
    toggleBtn.classList.toggle('is-active', isOpen);
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Fades/slides elements with the ".reveal" class into view as the
 * user scrolls to them, using IntersectionObserver. If the visitor
 * has requested reduced motion, everything is shown immediately
 * instead (see the prefers-reduced-motion check below).
 */
function initScrollReveal() {
  var revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}

/**
 * Handles the contact form submission via Web3Forms
 * (https://web3forms.com) — the form's hidden "access_key" input
 * (see contact.html) tells Web3Forms which inbox to relay the
 * submission to. On submit, the data is POSTed directly in the
 * background; nothing opens on the visitor's device, and the page
 * just shows a confirmation once Web3Forms confirms delivery.
 */
function initContactForm() {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields before sending.';
      return;
    }

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Sending...';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: form.access_key.value,
        name: name,
        email: email,
        message: message,
        subject: 'Portfolio contact from ' + name,
      }),
    })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (result.success) {
          status.textContent = 'Thanks, ' + name + '! Your message has been sent.';
          form.reset();
        } else {
          status.textContent = 'Something went wrong. Please try again, or email me directly.';
        }
      })
      .catch(function () {
        status.textContent = 'Something went wrong. Please try again, or email me directly.';
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
}