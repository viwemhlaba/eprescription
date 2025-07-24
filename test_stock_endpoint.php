<?php

require_once __DIR__ . '/vendor/autoload.php';

// Test the stock report endpoint
$baseUrl = 'http://127.0.0.1:8000/manager/reports/stock-pdf';

$params = [
    'group_by' => 'dosage_form',
    'stock_filter' => 'all',
    'include_zero_stock' => 'false',
    'sort_by' => 'name',
    'sort_direction' => 'asc'
];

$url = $baseUrl . '?' . http_build_query($params);

echo "Testing URL: $url\n\n";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'X-Requested-With: XMLHttpRequest'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
