<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescription - {{ $prescription->name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header h2 {
            margin: 5px 0 0 0;
            font-size: 16px;
            color: #666;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
        }
        .info-grid {
            display: table;
            width: 100%;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            font-weight: bold;
            width: 150px;
            padding: 5px 0;
        }
        .info-grid-three {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
            margin-bottom: 10px;
        }
        .info-grid-three > div {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #fafafa;
        }
        .medications-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .medications-table th,
        .medications-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .medications-table th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .signature-section {
            margin-top: 40px;
            display: table;
            width: 100%;
        }
        .signature-box {
            display: table-cell;
            width: 50%;
            text-align: center;
            padding: 20px 0;
        }
        .signature-line {
            border-top: 1px solid #333;
            margin-top: 40px;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PRESCRIPTION</h1>
        <h2>Manual Prescription</h2>
    </div>

    <!-- Prescription Information - Directly under title -->
    <div class="section">
        <div class="section-title">Prescription Information</div>
        <div class="info-grid">
            <div class="info-row">
                <div class="info-label">Prescription Name:</div>
                <div class="info-value">{{ $prescription->name ?? 'N/A' }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Date Created:</div>
                <div class="info-value">{{ $prescription->created_at->format('d/m/Y H:i') }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Status:</div>
                <div class="info-value">{{ ucfirst($prescription->status) }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Total Repeats:</div>
                <div class="info-value">{{ $prescription->repeats_total }}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Repeats Used:</div>
                <div class="info-value">{{ $prescription->repeats_used }}</div>
            </div>
            @if($prescription->next_repeat_date)
            <div class="info-row">
                <div class="info-label">Next Repeat Date:</div>
                <div class="info-value">{{ \Carbon\Carbon::parse($prescription->next_repeat_date)->format('d/m/Y') }}</div>
            </div>
            @endif
            <div class="info-row">
                <div class="info-label">Delivery Method:</div>
                <div class="info-value">{{ ucfirst($prescription->delivery_method ?? 'Not specified') }}</div>
            </div>
        </div>
    </div>

    <!-- Three Column Section: Patient, Doctor, Pharmacist Info -->
    <div class="section" style="margin-bottom: 30px;">
        <div class="info-grid-three">
            <!-- Patient Information -->
            <div>
                <div class="section-title" style="font-size: 14px; margin-bottom: 15px;">Patient Information</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Name:</div>
                        <div class="info-value">{{ $customer->name ?? 'N/A' }} {{ $customer->surname ?? '' }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">ID Number:</div>
                        <div class="info-value">{{ $customer->customer->id_number ?? $prescription->patient_id_number ?? 'N/A' }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ $customer->email ?? 'N/A' }}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Phone:</div>
                        <div class="info-value">{{ $customer->customer->cellphone_number ?? $customer->phone ?? 'N/A' }}</div>
                    </div>
                    @if($customer && $customer->customer && ($customer->customer->address_line_1 || $customer->customer->city))
                    <div class="info-row">
                        <div class="info-label">Address:</div>
                        <div class="info-value" style="font-size: 10px;">
                            @if($customer->customer->address_line_1){{ $customer->customer->address_line_1 }}<br>@endif
                            @if($customer->customer->address_line_2){{ $customer->customer->address_line_2 }}<br>@endif
                            @if($customer->customer->city){{ $customer->customer->city }}@endif
                            @if($customer->customer->postal_code), {{ $customer->customer->postal_code }}@endif
                        </div>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Doctor Information -->
            <div>
                <div class="section-title" style="font-size: 14px; margin-bottom: 15px;">Doctor Information</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Name:</div>
                        <div class="info-value">
                            @if($doctor)
                                Dr. {{ $doctor->name }} {{ $doctor->surname }}
                            @else
                                N/A
                            @endif
                        </div>
                    </div>
                    @if($doctor && $doctor->practice_number)
                    <div class="info-row">
                        <div class="info-label">Practice Number:</div>
                        <div class="info-value">{{ $doctor->practice_number }}</div>
                    </div>
                    @endif
                    @if($doctor && $doctor->email)
                    <div class="info-row">
                        <div class="info-label">Email:</div>
                        <div class="info-value">{{ $doctor->email }}</div>
                    </div>
                    @endif
                    @if($doctor && $doctor->phone)
                    <div class="info-row">
                        <div class="info-label">Phone:</div>
                        <div class="info-value">{{ $doctor->phone }}</div>
                    </div>
                    @endif
                    @if($doctor && $doctor->specialization)
                    <div class="info-row">
                        <div class="info-label">Specialization:</div>
                        <div class="info-value">{{ $doctor->specialization }}</div>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Pharmacist Information -->
            <div>
                <div class="section-title" style="font-size: 14px; margin-bottom: 15px;">Pharmacist Information</div>
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Pharmacist:</div>
                        <div class="info-value">{{ Auth::user()->name ?? 'Not Available' }} {{ Auth::user()->surname ?? '' }}</div>
                    </div>
                    @php
                        $pharmacistProfile = Auth::user() && Auth::user()->role === 'pharmacist' 
                            ? \App\Models\PharmacistProfile::with('pharmacy')->where('user_id', Auth::id())->first()
                            : null;
                    @endphp
                    @if($pharmacistProfile && $pharmacistProfile->license_number)
                    <div class="info-row">
                        <div class="info-label">License Number:</div>
                        <div class="info-value">{{ $pharmacistProfile->license_number }}</div>
                    </div>
                    @endif
                    @if($pharmacistProfile && $pharmacistProfile->pharmacy)
                    <div class="info-row">
                        <div class="info-label">Pharmacy:</div>
                        <div class="info-value">{{ $pharmacistProfile->pharmacy->name }}</div>
                    </div>
                    @if($pharmacistProfile->pharmacy->phone)
                    <div class="info-row">
                        <div class="info-label">Pharmacy Phone:</div>
                        <div class="info-value">{{ $pharmacistProfile->pharmacy->phone }}</div>
                    </div>
                    @endif
                    @if($pharmacistProfile->pharmacy->address)
                    <div class="info-row">
                        <div class="info-label">Pharmacy Address:</div>
                        <div class="info-value" style="font-size: 10px;">{{ $pharmacistProfile->pharmacy->address }}</div>
                    </div>
                    @endif
                    @endif
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Medications</div>
        @if($items && $items->count() > 0)
            <table class="medications-table">
                <thead>
                    <tr>
                        <th>Medication</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th>Quantity</th>
                        <th>Instructions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                    <tr>
                        <td>{{ $item->medication->name ?? 'N/A' }}</td>
                        <td>{{ $item->dosage ?? 'N/A' }}</td>
                        <td>{{ $item->frequency ?? 'N/A' }}</td>
                        <td>{{ $item->duration ?? 'N/A' }}</td>
                        <td>{{ $item->quantity ?? 'N/A' }}</td>
                        <td>{{ $item->instructions ?? 'N/A' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No medications specified.</p>
        @endif
    </div>

    @if($prescription->notes)
    <div class="section">
        <div class="section-title">Additional Notes</div>
        <p>{{ $prescription->notes }}</p>
    </div>
    @endif

    <div class="signature-section">
        <div class="signature-box">
            <div class="signature-line">
                Pharmacist Signature
            </div>
        </div>
        <div class="signature-box">
            <div class="signature-line">
                Date: {{ now()->format('d/m/Y') }}
            </div>
        </div>
    </div>

    <div class="footer">
        <p>This prescription was generated electronically and is valid for the purposes of medication dispensing.</p>
        <p>Prescription ID: {{ $prescription->id }} | Generated on: {{ now()->format('d/m/Y H:i:s') }}</p>
    </div>
</body>
</html>
