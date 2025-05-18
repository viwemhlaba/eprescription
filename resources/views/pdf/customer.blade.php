<!DOCTYPE html>
<html>
<head>
    <title>Prescription Report</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <h2>Prescription Report</h2>
    <p>Generated: {{ now()->format('Y-m-d H:i') }}</p>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Upload Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($prescriptions as $prescription)
                <tr>
                    <td>{{ $prescription->name }}</td>
                    <td>{{ ucfirst($prescription->status) }}</td>
                    <td>{{ $prescription->created_at->format('Y-m-d') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
