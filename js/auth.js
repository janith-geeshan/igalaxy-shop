/* ============================================================
   iGalaxy — Auth JS (Sign-In & Sign-Up forms)
   ============================================================ */

// ── Toast ─────────────────────────────────────────────────────
function showToast(message, type = 'success', duration = 4000) {
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

// ── Password visibility toggle ─────────────────────────────
document.querySelectorAll('[data-pw-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.pwToggle);
        const isText = input.type === 'text';
        input.type = isText ? 'password' : 'text';
        btn.textContent = isText ? '👁️' : '🙈';
    });
});

// ── Password strength ──────────────────────────────────────
function calcStrength(pw) {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
}

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

const pwInput = document.getElementById('password');
const strengthBar = document.getElementById('strength-bar');
const strengthLabel = document.getElementById('strength-label');

if (pwInput && strengthBar) {
    pwInput.addEventListener('input', () => {
        const score = calcStrength(pwInput.value);
        strengthBar.className = `strength-bar strength-${pwInput.value ? score : 0}`;
        if (strengthLabel) strengthLabel.textContent = pwInput.value ? strengthLabels[score] : '';
    });
}

// ── Form submission helper ─────────────────────────────────
async function submitForm(formId, action) {
    const form = document.getElementById(formId);
    const btn = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    data.append('action', action);

    // Basic client-side validation
    let valid = true;
    form.querySelectorAll('input[required]').forEach(inp => {
        if (!inp.value.trim()) {
            inp.style.borderColor = 'var(--error)';
            valid = false;
        } else {
            inp.style.borderColor = '';
        }
    });
    if (!valid) { showToast('Please fill in all required fields.', 'error'); return; }

    // Confirm passwords (register only)
    const confirm = form.querySelector('#confirm_password');
    if (confirm && confirm.value !== pwInput?.value) {
        showToast('Passwords do not match.', 'error');
        confirm.style.borderColor = 'var(--error)';
        return;
    }

    // Disable button with spinner
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Please wait…';

    try {
        const res = await fetch('php/auth.php', { method: 'POST', body: data });
        const json = await res.json();

        if (json.success) {
            // For login: append ?welcomed=1 so the home page shows a welcome toast
            const redirectUrl = json.redirect
                ? (action === 'login' ? json.redirect.replace('index.html', 'index.html?welcomed=1') : json.redirect)
                : null;
            showToast(json.message, 'success');
            if (redirectUrl) {
                setTimeout(() => { window.location.href = redirectUrl; }, 900);
            }
        } else {
            showToast(json.message, 'error');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    } catch (err) {
        showToast('Network error. Please try again.', 'error');
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ── Wire up login form ─────────────────────────────────────
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        submitForm('login-form', 'login');
    });
}

// ── Wire up register form ──────────────────────────────────
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', e => {
        e.preventDefault();
        submitForm('register-form', 'register');
    });
}
