<?php

require_once 'vendor/autoload.php';

use App\Mail\RepeatRejectedMail;
use App\Models\Customer\Prescription;

// Test the email functionality
$prescription = Prescription::with(['user', 'doctor'])->first();

if ($prescription) {
    try {
        $mail = new RepeatRejectedMail($prescription, 'Test rejection note from pharmacist');
        echo "✅ RepeatRejectedMail class created successfully\n";
        echo "📧 Email would be sent to: " . $prescription->user->email . "\n";
        echo "💊 For prescription: " . $prescription->name . "\n";
    } catch (Exception $e) {
        echo "❌ Error creating email: " . $e->getMessage() . "\n";
    }
} else {
    echo "⚠️ No prescriptions found in database\n";
}
