<?php
// Test SQL Server connection directly
$serverName = "localhost,1433";
$database = "GRP-04-16";
$username = "grp_user";
$password = "grp-04-16-pass";

echo "Testing SQL Server connection...\n";

try {
    // Test with basic connection string
    $dsn = "sqlsrv:Server=$serverName;Database=$database";
    echo "DSN: $dsn\n";
    
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connection successful!\n";
    
    $stmt = $pdo->query("SELECT @@VERSION as version");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "SQL Server Version: " . $result['version'] . "\n";
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n";
}

// Test with different options
echo "\n\nTesting with different connection options...\n";

try {
    $dsn = "sqlsrv:Server=$serverName;Database=$database;TrustServerCertificate=yes";
    echo "DSN: $dsn\n";
    
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "Connection with TrustServerCertificate successful!\n";
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}

// Test Windows Authentication
echo "\n\nTesting Windows Authentication...\n";
try {
    $dsn = "sqlsrv:Server=$serverName;Database=$database";
    echo "DSN: $dsn\n";
    
    $pdo = new PDO($dsn, "", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "Windows Authentication successful!\n";
    
} catch (PDOException $e) {
    echo "Windows Auth failed: " . $e->getMessage() . "\n";
}
?>
