// CONFIGURATION: Paste your published Google Sheets CSV link here
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQoP26XOcZV6WPI6JdkFKYZautNQOMiP88vgQFKfs4rYGX7PJ6mIOUnsEpw3YOIDh8r1kwKSgY_pY6u/pub?output=csv';

// GOOGLE SHEETS CONTACT FORM CONFIGURATION
// See HOW_TO_SETUP_CONTACT_FORM.md for step-by-step instructions.
const GOOGLE_SHEET_FORM_URL = 'https://script.google.com/macros/s/AKfycbxGt2gaQlv3TV9N2ju68YQrAbVeShTIfWkzxwNBCHYjffRrWUMrwX-XuIJECOPv1qV5/exec';

// Helper to parse RFC 4180 CSV strings
function parseCSV(csvText) {
  const lines = [];
  let row = [""];
  let inQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      lines.push(row);
      row = [''];
    } else {
      row[row.length - 1] += char;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }
  return lines;
}

// Helper to convert Google Drive share links to direct rendering links
function getGoogleDriveDirectLink(url) {
  if (!url) return '';
  url = url.trim();
  const regexes = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
    /\/uc\?id=([a-zA-Z0-9_-]+)/
  ];
  for (const regex of regexes) {
    const match = url.match(regex);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }
  return url;
}

document.addEventListener('DOMContentLoaded', () => {

  // Start loading dynamic posters immediately
  console.log("DOMContentLoaded: Triggering loadDynamicPosters");
  loadDynamicPosters();

  // 1. DYNAMIC PRELOADER TIMING
  const preloader = document.getElementById('preloader');
  const appContent = document.getElementById('app-content');
  const loaderBar = document.getElementById('horizontal-loader-bar');

  // Trigger smooth GPU-accelerated CSS transition immediately on page load
  if (loaderBar) {
    setTimeout(() => {
      loaderBar.style.width = '100%';
    }, 100);
  }

  // Transition out the preloader after exactly 4 seconds
  setTimeout(() => {
    preloader.classList.add('loaded');
    appContent.classList.add('visible');

    // Trigger animations that occur on load
    triggerOnLoadAnimations();
  }, 4100);


  // 2. INTERACTIVE CURSOR GLOW & BACKGROUND GLOW TRACKING
  const cursorGlow = document.getElementById('cursor-glow');
  document.addEventListener('mousemove', (e) => {
    // Global cursor glow positioning
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;

    // Set custom CSS variables for ambient background coordinate tracking
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  });


  // 3. CARD-SPECIFIC MOUSE GLOW EFFECT (Premium Hover Effect)
  const workCards = document.querySelectorAll('.work-card');
  workCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // 4. FLOATING NAVBAR SCROLL STATE & ACTIVE LINKS
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  const heroSection = document.getElementById('profile');

  let lastScrollY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600;

        // Header styling on scroll
        if (currentScrollY > 50) {
          mainNav.classList.add('scrolled');
        } else {
          mainNav.classList.remove('scrolled');
        }

        // Auto-hide logic: always visible in hero, hide on scroll down, show on scroll up
        if (currentScrollY <= heroBottom) {
          // Inside hero section — always show
          mainNav.classList.remove('nav-hidden');
        } else if (currentScrollY > lastScrollY && currentScrollY > heroBottom) {
          // Scrolling DOWN past hero — hide
          mainNav.classList.add('nav-hidden');
        } else if (currentScrollY < lastScrollY) {
          // Scrolling UP — show
          mainNav.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;

        // Nav link indicator mapping on scroll
        let currentActiveSectionId = '';
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 120;
          const sectionHeight = section.clientHeight;
          if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
            currentActiveSectionId = section.getAttribute('id');
          }
        });

        if (currentActiveSectionId) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
              link.classList.add('active');
            }
          });
        }

        ticking = false;
      });
      ticking = true;
    }
  });


  // 5. MOBILE NAVIGATION TOGGLE
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger toggle lines
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));

    if (navMenu.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    });
  });


  // 6. SCROLL REVEAL ANIMATIONS (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-el');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Trigger specific animations if section contains metrics
        if (entry.target.classList.contains('about-section') || entry.target.querySelector('.about-metrics')) {
          animateMetrics();
        }

        observer.unobserve(entry.target); // Unobserve once animated
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // 7. METRIC COUNTING ANIMATIONS
  let metricsAnimated = false;
  function animateMetrics() {
    if (metricsAnimated) return;
    metricsAnimated = true;

    const countUp = (elementId, targetVal, suffix = '', duration = 1500) => {
      const el = document.getElementById(elementId);
      if (!el) return;

      let start = 0;
      const stepTime = Math.abs(Math.floor(duration / targetVal));

      const timer = setInterval(() => {
        start += 1;
        el.textContent = start + suffix;
        if (start >= targetVal) {
          el.textContent = targetVal + suffix;
          clearInterval(timer);
        }
      }, Math.max(stepTime, 20));
    };

    countUp('metric-exp', 5, '+');
    countUp('metric-proj', 40, '+');
    countUp('metric-sat', 98, '%');
  }


  // 8. SLIDE TO SEE GALLERY BUTTON & POSTERS SLIDER 3D COVERFLOW LOGIC
  function initPosterSlider() {
    console.log("initPosterSlider: entering function");
    const postersSlider = document.getElementById('posters-slider');
    if (!postersSlider) {
      console.log("initPosterSlider: #posters-slider not found!");
      return;
    }

    const posterCards = postersSlider.querySelectorAll('.poster-slide-card');
    console.log("initPosterSlider: found posterCards count =", posterCards.length);
    if (posterCards.length === 0) return;

    const slideBtn = document.getElementById('btn-slide-gallery');
    const posterPrevBtn = document.getElementById('btn-poster-prev');
    const posterNextBtn = document.getElementById('btn-poster-next');

    // Start with the middle card active, or 0 if only 1 card
    let posterActiveIndex = Math.max(0, Math.floor(posterCards.length / 2));
    console.log("initPosterSlider: posterActiveIndex =", posterActiveIndex);

    function updatePosterCoverflow() {
      const n = posterCards.length;
      posterCards.forEach((card, idx) => {
        card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

        let diff = idx - posterActiveIndex;
        // Circular wrap calculation for the shortest path
        if (diff < -n / 2) diff += n;
        if (diff > n / 2) diff -= n;

        if (diff === 0) {
          card.classList.add('active');
        } else if (diff === -1) {
          card.classList.add('prev');
        } else if (diff === 1) {
          card.classList.add('next');
        } else if (diff === -2) {
          card.classList.add('far-prev');
        } else if (diff === 2) {
          card.classList.add('far-next');
        }
      });
    }

    // Initialize layout
    updatePosterCoverflow();

    // Flanking card click support
    posterCards.forEach((card, idx) => {
      card.onclick = () => {
        if (idx !== posterActiveIndex) {
          posterActiveIndex = idx;
          updatePosterCoverflow();
        }
      };
    });

    if (posterPrevBtn) {
      posterPrevBtn.onclick = () => {
        posterActiveIndex = (posterActiveIndex - 1 + posterCards.length) % posterCards.length;
        updatePosterCoverflow();
      };
    }

    if (posterNextBtn) {
      posterNextBtn.onclick = () => {
        posterActiveIndex = (posterActiveIndex + 1) % posterCards.length;
        updatePosterCoverflow();
      };
    }

    // 'Slide to see Gallery' scroll shortcut
    if (slideBtn) {
      slideBtn.onclick = () => {
        const postersSection = document.getElementById('posters');
        if (postersSection) {
          postersSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
          posterActiveIndex = (posterActiveIndex + 1) % posterCards.length;
          updatePosterCoverflow();
        }, 400);
      };
    }
  }


  // 9. DYNAMIC POSTER LOADER (from local posters.csv or Google Sheets)
  //
  // HOW IT WORKS:
  //   - The website reads poster data from "posters.csv" in the same folder.
  //   - To add a poster: open posters.csv in Excel, add a new row.
  //   - To remove a poster: delete the row in Excel and save.
  //   - Image column can be a filename (e.g. poster_1.png) placed in the
  //     same folder, OR a Google Drive share link.
  //   - If GOOGLE_SHEET_CSV_URL is set above, it will use that instead.
  //
  async function loadDynamicPosters() {
    console.log("loadDynamicPosters: entering function");
    const postersSlider = document.getElementById('posters-slider');
    if (!postersSlider) {
      console.log("loadDynamicPosters: #posters-slider not found!");
      return;
    }

    // Decide the CSV source: Google Sheets URL if provided, otherwise local file
    const csvUrl = GOOGLE_SHEET_CSV_URL || 'posters.csv';
    console.log("loadDynamicPosters: loading from", csvUrl);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`Failed to load ${csvUrl} (HTTP ${response.status})`);
      }
      const csvData = await response.text();
      const rows = parseCSV(csvData);

      if (rows.length <= 1) {
        throw new Error("CSV file is empty or contains only headers.");
      }

      // Identify column indices based on header names (case-insensitive)
      const headers = rows[0].map(h => h.trim().toLowerCase());
      const titleIdx = headers.indexOf('title');
      const tagIdx = headers.indexOf('tag');
      const urlIdx = headers.findIndex(h => h === 'image url' || h === 'image');
      const altIdx = headers.findIndex(h => h === 'alt text' || h === 'alt');

      // Fallback column indexes if headers don't match exactly
      const finalTitleIdx = titleIdx !== -1 ? titleIdx : 0;
      const finalTagIdx = tagIdx !== -1 ? tagIdx : 1;
      const finalUrlIdx = urlIdx !== -1 ? urlIdx : 2;
      const finalAltIdx = altIdx !== -1 ? altIdx : 3;

      const items = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 3) continue; // Skip incomplete lines

        const title = row[finalTitleIdx] ? row[finalTitleIdx].trim() : '';
        const tag = row[finalTagIdx] ? row[finalTagIdx].trim() : '';
        const rawUrl = row[finalUrlIdx] ? row[finalUrlIdx].trim() : '';
        const altText = row[finalAltIdx] ? row[finalAltIdx].trim() : `${tag} - ${title}`;

        if (!rawUrl) continue; // Skip rows without an image

        // Convert Google Drive links to direct image URLs, or use as-is
        const imageUrl = getGoogleDriveDirectLink(rawUrl);
        items.push({ title, tag, imageUrl, altText });
      }

      if (items.length === 0) {
        throw new Error("No valid poster entries found in CSV.");
      }

      // Clear current content and render poster cards from CSV data
      postersSlider.innerHTML = '';
      items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'poster-slide-card';

        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = '';

        article.appendChild(img);

        postersSlider.appendChild(article);
      });

      // Initialize the 3D slider with the loaded cards
      initPosterSlider();

    } catch (error) {
      console.warn("Could not load posters.csv, using static HTML fallback:", error.message);
      // Fall back to the hardcoded HTML posters
      initPosterSlider();
    }
  }


  // 10. ON LOAD TRIGGERS
  function triggerOnLoadAnimations() {
    // Ensure profile section elements are revealed immediately
    const galleryElements = document.querySelectorAll('#profile .reveal-el');
    galleryElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('active');
      }, index * 200);
    });
  }


  // 11. CONTACT FORM — GOOGLE SHEETS
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const submitBtn = document.getElementById('btn-send-msg');
      const originalText = submitBtn.textContent;

      // Check if Google Sheets form URL is configured
      if (!GOOGLE_SHEET_FORM_URL) {
        alert('Contact form is not configured yet. Please email sandhyachejarla5@gmail.com directly.');
        return;
      }

      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Collect form data
      const formData = {
        first_name: contactForm.first_name.value,
        last_name: contactForm.last_name.value,
        email: contactForm.email.value,
        message: contactForm.message.value
      };

      try {
        const response = await fetch(GOOGLE_SHEET_FORM_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        // With no-cors, we can't read the response, but if fetch didn't throw, it was sent
        submitBtn.textContent = '✓ Message Sent!';
        submitBtn.style.background = 'linear-gradient(90deg, #00c853 0%, #00e676 100%)';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
        }, 3000);

      } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.textContent = '✗ Failed to send';
        submitBtn.style.background = 'linear-gradient(90deg, #d32f2f 0%, #f44336 100%)';

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.background = '';
        }, 3000);
      }
    });
  }
});
