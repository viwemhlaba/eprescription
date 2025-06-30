<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Prescription Approved</title>
</head>
<body>
<h2>Hello {{ $prescription->user->name }},</h2>

<p>Your prescription "<strong>{{ $prescription->name }}</strong>" has been approved by our pharmacist.</p>

<p><strong>Total Due: {{ $prescription->formatted_total_due }}</strong></p>

<p>You can now proceed to the next steps as discussed or await further instructions.</p>

<p>Thank you,<br>
    Ibhayi Pharmacy</p>
</body>
</html>
