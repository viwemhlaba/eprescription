<?php

use Illuminate\Support\Facades\Mail;

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    Mail::raw('Test email from Laravel application', function ($message) {
        $message->to('test@example.com')
                ->subject('Test Email - Configuration Check');
    });
    
    echo "Email sent successfully! Check your Mailtrap inbox.\n";
} catch (Exception $e) {
    echo "Email sending failed: " . $e->getMessage() . "\n";
}
