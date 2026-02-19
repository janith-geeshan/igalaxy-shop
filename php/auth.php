<?php
// ============================================================
// iGalaxy — Authentication Endpoint
// Handles: action=register  and  action=login
// Returns JSON: { success: bool, message: string, user?: {} }
// ============================================================

session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/db.php';

$action = $_POST['action'] ?? '';

// ── Helper ───────────────────────────────────────────────────
function respond(bool $success, string $message, array $extra = []): void {
    echo json_encode(array_merge(['success' => $success, 'message' => $message], $extra));
    exit;
}

// ── REGISTER ─────────────────────────────────────────────────
if ($action === 'register') {
    $fullName = trim($_POST['full_name'] ?? '');
    $email    = strtolower(trim($_POST['email'] ?? ''));
    $phone    = trim($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm  = $_POST['confirm_password'] ?? '';

    // Server-side validation
    if (!$fullName || !$email || !$password) {
        respond(false, 'Full name, email and password are required.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(false, 'Please enter a valid email address.');
    }
    if (strlen($password) < 8) {
        respond(false, 'Password must be at least 8 characters.');
    }
    if ($password !== $confirm) {
        respond(false, 'Passwords do not match.');
    }

    // Check duplicate email
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        respond(false, 'An account with this email already exists.');
    }

    // Insert
    $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    $stmt = $pdo->prepare(
        'INSERT INTO users (full_name, email, password, phone) VALUES (?, ?, ?, ?)'
    );
    $stmt->execute([$fullName, $email, $hash, $phone ?: null]);

    // Do NOT auto-login after registration — redirect to sign-in so the user logs in explicitly
    respond(true, 'Account created! Please sign in to continue.', ['redirect' => 'login.html?registered=1']);
}

// ── LOGIN ────────────────────────────────────────────────────
if ($action === 'login') {
    $email    = strtolower(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';

    if (!$email || !$password) {
        respond(false, 'Email and password are required.');
    }

    $stmt = $pdo->prepare('SELECT id, full_name, email, password FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        // Generic message — don't reveal which field is wrong
        respond(false, 'Invalid email or password.');
    }

    $_SESSION['user'] = [
        'id'        => (int)$user['id'],
        'full_name' => $user['full_name'],
        'email'     => $user['email'],
    ];

    respond(true, 'Welcome back, ' . $user['full_name'] . '!', ['redirect' => 'index.html']);
}

// ── SESSION CHECK ────────────────────────────────────────────
if ($action === 'check') {
    if (isset($_SESSION['user'])) {
        respond(true, 'Authenticated', ['user' => $_SESSION['user']]);
    }
    respond(false, 'Not authenticated');
}

respond(false, 'Unknown action.');
