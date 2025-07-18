<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prescription #{{ $prescription->id }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #333;
            margin: 0;
            padding: 15px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .prescription-title {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin: 0 0 5px 0;
        }
        .prescription-subtitle {
            font-size: 14px;
            color: #6b7280;
        }
        .section {
            margin-bottom: 15px;
            page-break-inside: avoid;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #1e40af;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 3px;
            margin-bottom: 8px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
        }
        .info-grid-three {
            display: table;
            width: 100%;
            table-layout: fixed;
            border-spacing: 15px 0;
        }
        .info-grid-three > div {
            display: table-cell;
            width: 33.333%;
            vertical-align: top;
            padding: 10px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            background-color: #fafafa;
        }
        .compact-section {
            margin-bottom: 10px;
            page-break-inside: avoid;
        }
        .info-item {
            margin-bottom: 5px;
        }
        .info-label {
            font-weight: bold;
            color: #374151;
        }
        .info-value {
            color: #6b7280;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .table th,
        .table td {
            border: 1px solid #d1d5db;
            padding: 5px;
            text-align: left;
        }
        .table th {
            background-color: #f3f4f6;
            font-weight: bold;
            color: #374151;
        }
        .table tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-approved {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .status-dispensed {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-rejected {
            background-color: #fecaca;
            color: #dc2626;
        }
        .total-row {
            font-weight: bold;
            background-color: #f3f4f6 !important;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            font-size: 10px;
            color: #6b7280;
            text-align: center;
        }
        .page-break {
            page-break-before: always;
        }
        .flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .mb-0 {
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="prescription-title">PRESCRIPTION</h1>
        <p class="prescription-subtitle">Prescription #{{ $prescription->id }} - {{ $prescription->name }}</p>
        @if($current_pharmacist && $current_pharmacist->pharmacy)
            <p style="margin: 10px 0 0 0; font-weight: bold;">{{ $current_pharmacist->pharmacy->name }}</p>
            <p style="margin: 0;">{{ $current_pharmacist->pharmacy->address ?? '' }}</p>
            <p style="margin: 0;">Registration: {{ $current_pharmacist->pharmacy->registration_number ?? '' }}</p>
        @endif
    </div>

    <!-- Prescription Information - Directly under title -->
    <div class="compact-section" style="margin-bottom: 20px;">
        <h3 class="section-title">Prescription Information</h3>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="status-badge status-{{ $prescription->status }}">{{ strtoupper($prescription->status) }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Type:</span>
                <span class="info-value">{{ $prescription->is_manual ? 'Manual Entry' : 'Uploaded' }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Delivery Method:</span>
                <span class="info-value">{{ ucfirst($prescription->delivery_method) }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Repeats:</span>
                <span class="info-value">{{ $prescription->repeats_used }} of {{ $prescription->repeats_total }} used</span>
            </div>
            <div class="info-item">
                <span class="info-label">Created:</span>
                <span class="info-value">{{ $prescription->created_at->format('M d, Y \a\t H:i') }}</span>
            </div>
            @if($prescription->next_repeat_date)
            <div class="info-item">
                <span class="info-label">Next Repeat:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($prescription->next_repeat_date)->format('M d, Y') }}</span>
            </div>
            @endif
        </div>
        @if($prescription->notes)
        <div class="info-item" style="margin-top: 10px;">
            <span class="info-label">Notes:</span>
            <span class="info-value">{{ $prescription->notes }}</span>
        </div>
        @endif
    </div>

    <!-- Three Column Section: Patient, Doctor, Pharmacist Info -->
    <div class="compact-section" style="margin-bottom: 20px;">
        <div class="info-grid-three">
            <!-- Patient Information -->
            <div>
                <h4 class="section-title" style="font-size: 12px; margin-bottom: 10px; color: #1e40af;">Patient Information</h4>
                <div class="info-item">
                    <span class="info-label">Name:</span><br>
                    <span class="info-value">{{ $patient->name }} {{ $patient->surname }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">ID Number:</span><br>
                    <span class="info-value">{{ $customer->id_number ?? $prescription->patient_id_number ?? 'Not Available' }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email:</span><br>
                    <span class="info-value">{{ $patient->email }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone:</span><br>
                    <span class="info-value">{{ $customer->cellphone_number ?? 'Not Available' }}</span>
                </div>
                @if($customer && ($customer->address_line_1 || $customer->address_line_2 || $customer->city))
                <div class="info-item">
                    <span class="info-label">Address:</span><br>
                    <span class="info-value" style="font-size: 10px;">
                        @if($customer->address_line_1){{ $customer->address_line_1 }}<br>@endif
                        @if($customer->address_line_2){{ $customer->address_line_2 }}<br>@endif
                        @if($customer->city){{ $customer->city }}@endif
                        @if($customer->postal_code), {{ $customer->postal_code }}@endif
                    </span>
                </div>
                @endif
            </div>

            <!-- Doctor Information -->
            <div>
                <h4 class="section-title" style="font-size: 12px; margin-bottom: 10px; color: #1e40af;">Doctor Information</h4>
                <div class="info-item">
                    <span class="info-label">Name:</span><br>
                    <span class="info-value">Dr. {{ $doctor->name }} {{ $doctor->surname }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Practice Number:</span><br>
                    <span class="info-value">{{ $doctor->practice_number }}</span>
                </div>
                @if($doctor->email)
                <div class="info-item">
                    <span class="info-label">Email:</span><br>
                    <span class="info-value">{{ $doctor->email }}</span>
                </div>
                @endif
                @if($doctor->phone)
                <div class="info-item">
                    <span class="info-label">Phone:</span><br>
                    <span class="info-value">{{ $doctor->phone }}</span>
                </div>
                @endif
                @if($doctor->specialization)
                <div class="info-item">
                    <span class="info-label">Specialization:</span><br>
                    <span class="info-value">{{ $doctor->specialization }}</span>
                </div>
                @endif
            </div>

            <!-- Pharmacist Information -->
            <div>
                <h4 class="section-title" style="font-size: 12px; margin-bottom: 10px; color: #1e40af;">Pharmacist Information</h4>
                @if($current_pharmacist)
                <div class="info-item">
                    <span class="info-label">Pharmacist:</span><br>
                    <span class="info-value">{{ $current_pharmacist->user->name ?? 'Not Available' }} {{ $current_pharmacist->user->surname ?? '' }}</span>
                </div>
                @if($current_pharmacist->license_number)
                <div class="info-item">
                    <span class="info-label">License Number:</span><br>
                    <span class="info-value">{{ $current_pharmacist->license_number }}</span>
                </div>
                @endif
                @if($current_pharmacist->pharmacy)
                <div class="info-item">
                    <span class="info-label">Pharmacy:</span><br>
                    <span class="info-value">{{ $current_pharmacist->pharmacy->name }}</span>
                </div>
                @if($current_pharmacist->pharmacy->phone)
                <div class="info-item">
                    <span class="info-label">Pharmacy Phone:</span><br>
                    <span class="info-value">{{ $current_pharmacist->pharmacy->phone }}</span>
                </div>
                @endif
                @if($current_pharmacist->pharmacy->address)
                <div class="info-item">
                    <span class="info-label">Pharmacy Address:</span><br>
                    <span class="info-value" style="font-size: 10px;">{{ $current_pharmacist->pharmacy->address }}</span>
                </div>
                @endif
                @endif
                @else
                <div class="info-item">
                    <span class="info-value">Pharmacist information not available</span>
                </div>
                @endif
            </div>
        </div>
    </div>

    <!-- Prescribed Medications -->
    <div class="compact-section">
        <h2 class="section-title">Prescribed Medications</h2>
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 25%">Medication</th>
                    <th style="width: 20%">Active Ingredients</th>
                    <th style="width: 25%">Instructions</th>
                    <th style="width: 8%" class="text-center">Qty</th>
                    <th style="width: 12%" class="text-center">Repeats</th>
                    <th style="width: 10%" class="text-right">Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                <tr>
                    <td><strong>{{ $item->medication->name }}</strong></td>
                    <td style="font-size: 10px;">{{ $item->medication->activeIngredients->pluck('name')->join(', ') ?: 'N/A' }}</td>
                    <td style="font-size: 10px;">{{ $item->instructions ?: '-' }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-center">{{ $item->repeats_used }}/{{ $item->repeats }}</td>
                    <td class="text-right">R{{ number_format($item->price, 2) }}</td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="5" class="text-right"><strong>Total Prescription Value:</strong></td>
                    <td class="text-right"><strong>R{{ number_format($totals['prescription_total_value'], 2) }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>

    @if($dispensed_history->count() > 0)
    <!-- Dispensing History -->
    <div class="compact-section">
        <h2 class="section-title">Dispensing History</h2>
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 15%">Date</th>
                    <th style="width: 20%">Medication</th>
                    <th style="width: 8%" class="text-center">Qty</th>
                    <th style="width: 20%">Pharmacist</th>
                    <th style="width: 25%">Pharmacy</th>
                    <th style="width: 12%" class="text-right">Cost</th>
                </tr>
            </thead>
            <tbody>
                @foreach($dispensed_history as $item)
                <tr>
                    <td style="font-size: 10px;">{{ $item->dispensed_at->format('M d, Y') }}<br><small>{{ $item->dispensed_at->format('H:i') }}</small></td>
                    <td>{{ $item->medication->name }}</td>
                    <td class="text-center">{{ $item->quantity_dispensed }}</td>
                    <td style="font-size: 10px;">{{ $item->pharmacist->name ?? 'Unknown' }}</td>
                    <td style="font-size: 10px;">{{ $item->pharmacist->pharmacistProfile->pharmacy->name ?? 'Unknown Pharmacy' }}</td>
                    <td class="text-right">R{{ number_format($item->cost, 2) }}</td>
                </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="5" class="text-right"><strong>Total Dispensed Value:</strong></td>
                    <td class="text-right"><strong>R{{ number_format($totals['total_cost'], 2) }}</strong></td>
                </tr>
            </tbody>
        </table>
        
        <div style="margin-top: 10px; padding: 8px; background-color: #f9fafb; border-left: 4px solid #3b82f6;">
            <div style="display: flex; justify-content: space-between;">
                <span><strong>Summary:</strong></span>
                <span><strong>Total Items Dispensed: {{ $totals['total_items_dispensed'] }}</strong></span>
            </div>
        </div>
    </div>
    @endif

    <div class="footer">
        <p class="mb-0">Document generated on {{ $generated_at->format('F d, Y \a\t H:i:s') }}</p>
        <p class="mb-0">This is a computer-generated document and does not require a signature.</p>
    </div>
</body>
</html>
