<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Prescription Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
        th { background: #f0f0f0; }
        h2 { margin-top: 30px; }
    </style>
</head>
<body>
    <h1>Prescription Report for {{ $user->name }}</h1>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Repeats Used / Total</th>
                <th>Next Repeat</th>
                <th>Uploaded</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($prescriptions as $p)
                <tr>
                    <td>{{ $p->name }}</td>
                    <td>{{ ucfirst($p->status) }}</td>
                    <td>{{ $p->repeats_used }} / {{ $p->repeats_total }}</td>
                    <td>{{ $p->next_repeat_date ?? 'N/A' }}</td>
                    <td>{{ $p->created_at->format('Y-m-d') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
