<?php
$dsn = 'sqlsrv:Server=localhost,1433;Database=GRP-04-16';
$username = 'grp_user';
$password = 'grp-04-16-pass';

// Test which PDO options work
$working_options = [];
$test_options = [
    PDO::ATTR_CASE => PDO::CASE_NATURAL,
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_ORACLE_NULLS => PDO::NULL_NATURAL,
    PDO::ATTR_STRINGIFY_FETCHES => false,
];

foreach ($test_options as $option => $value) {
    try {
        $pdo = new PDO($dsn, $username, $password, [$option => $value]);
        $working_options[$option] = $value;
        echo "Option $option works\n";
        $pdo = null;
    } catch (Exception $e) {
        echo "Option $option failed: " . $e->getMessage() . "\n";
    }
}

echo "\nTesting all working options together:\n";
try {
    $pdo = new PDO($dsn, $username, $password, $working_options);
    echo "All working options succeeded!\n";
    print_r($working_options);
} catch (Exception $e) {
    echo "Combined options failed: " . $e->getMessage() . "\n";
}
?>
