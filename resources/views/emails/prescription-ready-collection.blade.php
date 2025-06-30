<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Prescription Ready for Collection</title>
</head>
<body>
<h2>Hello {{ $prescription->user->name }},</h2>

<p>Your prescription "<strong>{{ $prescription->name }}</strong>" has been dispensed and is now ready for collection.</p>

<p>Please visit us at your earliest convenience to collect your medication. Remember to bring a valid form of identification.</p>

<p><strong>Collection Details:</strong></p>
<ul>
    <li>Prescription: {{ $prescription->name }}</li>
    <li>Patient ID: {{ $prescription->patient_id_number ?? 'N/A' }}</li>
    <li>Date Dispensed: {{ now()->format('Y-m-d') }}</li>
    <li><strong>Total Due: {{ $prescription->formatted_total_due }}</strong></li>
    @if($prescription->repeats_used < $prescription->repeats_total)
        <li>Remaining Repeats: {{ $prescription->repeats_total - $prescription->repeats_used }}</li>
        @if($prescription->next_repeat_date)
            <li>Next Repeat Available: {{ $prescription->next_repeat_date }}</li>
        @endif
    @endif
</ul>

<p>If you have any questions, please don't hesitate to contact us.</p>

<p>Thank you,<br>
    Ibhayi Pharmacy</p>
</body>
</html>
