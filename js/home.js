/* ============================================================
   iGalaxy — Home Page JS
   ============================================================ */

// ── Toast (same helper used by auth.js on auth pages) ─────
function showToast(message, type = 'success', duration = 4500) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const icon = type === 'success' ? '✓' : '✕';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.35s forwards';
        toast.addEventListener('animationend', () => toast.remove());
    }, duration);
}

// ── Session check → swap nav states ───────────────────────
async function checkSession() {
    try {
        const res = await fetch('php/auth.php', {
            method: 'POST',
            body: new URLSearchParams({ action: 'check' })
        });
        const json = await res.json();
        return json.success ? json.user : null;
    } catch { return null; }
}

(async () => {
    const user = await checkSession();

    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const mobileGuestNav = document.getElementById('mobile-guest-nav');
    const mobileUserNav = document.getElementById('mobile-user-nav');
    const userName = document.getElementById('user-display-name');
    const mobileUserName = document.getElementById('mobile-user-name');
    const avatar = document.getElementById('avatar-initials');

    if (user) {
        // ── Logged-in: hide guest nav, show user nav ──
        if (guestNav) guestNav.style.display = 'none';
        if (mobileGuestNav) mobileGuestNav.style.display = 'none';
        if (userNav) userNav.style.display = 'flex';
        if (mobileUserNav) mobileUserNav.style.display = 'block';

        // Populate name & avatar initial
        const first = user.full_name.split(' ')[0];
        if (userName) userName.textContent = first;
        if (mobileUserName) mobileUserName.textContent = user.full_name;
        if (avatar) avatar.textContent = user.full_name.charAt(0).toUpperCase();

        // Show welcome toast if redirected from login (?welcomed=1)
        const params = new URLSearchParams(window.location.search);
        if (params.get('welcomed') === '1') {
            showToast(`Welcome back, ${first}! 👋`, 'success');
            // Clean the URL without reloading
            history.replaceState(null, '', window.location.pathname);
        }
    }
    // If no session: guest nav is already visible by default — nothing to do
})();


// ── Navbar scroll shrink ───────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
}

// ── Scroll-reveal ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Mobile menu toggle ─────────────────────────────────────
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}
