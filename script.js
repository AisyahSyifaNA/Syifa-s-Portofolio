window.addEventListener('DOMContentLoaded', () => {
  setupQuotes();
  setupMobileNav();
  setupScrollReveal();
  setupTimelineProgress();
  setupBackToTop();
  setupThemeToggle();
});

function setupThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (!toggle) return;

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(initial);

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      toggle.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      toggle.textContent = '🌙';
    }
  }
}

function setupBackToTop() {
  const btn = document.getElementById('footerScrollTop');
  if (!btn) return;
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  btn.addEventListener('click', scrollTop);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollTop(); }
  });
}

/* QUOTES */
function setupQuotes() {
  const quotes = [
    { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Good design is obvious. Great design is transparent.", author: "Joe Sparano" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" }
  ];

  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const newQuoteBtn = document.getElementById('new-quote');

  function displayRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${random.text}"`;
    quoteAuthor.textContent = `— ${random.author}`;
  }

  newQuoteBtn.addEventListener('click', displayRandomQuote);
  displayRandomQuote();
}

/* MOBILE NAV */
function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

/* SCROLL REVEAL */
function setupScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}

/* CONTACT FORM -> EMAIL */
document.getElementById('emailForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const subject = `New message from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

  const mailtoLink = `mailto:aisyah.syifaa.na@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoLink;
});

/* EXPERIENCE TIMELINE: progress line fills + active dot as you scroll */
function setupTimelineProgress() {
  const timeline = document.getElementById('expTimeline');
  const progress = document.getElementById('timelineProgress');
  if (!timeline || !progress) return;

  const items = Array.from(timeline.querySelectorAll('.timeline-item'));
  const dots = items.map(item => item.querySelector('.timeline-dot'));

  function update() {
    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.55;

    // How far the center of the viewport has moved into the timeline
    const scrolled = viewportCenter - rect.top;
    const total = rect.height;
    const ratio = Math.max(0, Math.min(1, scrolled / total));

    progress.style.height = `${ratio * 100}%`;

    // Highlight the item whose dot the progress line has just passed
    let activeIndex = -1;
    items.forEach((item, i) => {
      const dotRect = item.querySelector('.timeline-dot').getBoundingClientRect();
      if (dotRect.top - rect.top <= scrolled) activeIndex = i;
    });

    items.forEach((item, i) => item.classList.toggle('active', i === activeIndex));
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}