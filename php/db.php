<?php
// ============================================================
// iGalaxy — Database Connection (PDO)
// ============================================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'igalaxy_test');
define('DB_USER', 'root');      // Change if your MySQL user is different
define('DB_PASS', 'janith2004');          // Change if you have a MySQL password set

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed.']);
    exit;
}
