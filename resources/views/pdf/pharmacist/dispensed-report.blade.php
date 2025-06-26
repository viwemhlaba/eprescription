<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dispensed Medications Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
        }
        
        .header h1 {
            margin: 0;
            color: #007bff;
            font-size: 24px;
        }
        
        .header h2 {
            margin: 5px 0 0 0;
            color: #666;
            font-size: 16px;
            font-weight: normal;
        }
        
        .report-info {
            display: table;
            width: 100%;
            margin-bottom: 20px;
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
        }
        
        .report-info-row {
            display: table-row;
        }
        
        .report-info-cell {
            display: table-cell;
            padding: 3px 10px;
            vertical-align: top;
        }
        
        .report-info-label {
            font-weight: bold;
            width: 150px;
        }
        
        .summary-stats {
            background-color: #e9ecef;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        
        .summary-stats h3 {
            margin: 0 0 10px 0;
            color: #495057;
        }
        
        .stats-grid {
            display: table;
            width: 100%;
        }
        
        .stats-row {
            display: table-row;
        }
        
        .stats-cell {
            display: table-cell;
            padding: 5px 10px;
            width: 25%;
        }
        
        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
        }
        
        .stat-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
        }
        
        .group-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .group-header {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            margin-bottom: 10px;
            font-weight: bold;
            font-size: 14px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        
        .items-table th {
            background-color: #495057;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 11px;
            font-weight: bold;
        }
        
        .items-table td {
            padding: 6px 8px;
            border-bottom: 1px solid #dee2e6;
            font-size: 11px;
        }
        
        .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        
        .group-summary {
            background-color: #fff3cd;
            padding: 8px 15px;
            margin-top: 10px;
            border-left: 4px solid #ffc107;
        }
        
        .group-summary strong {
            color: #856404;
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #dee2e6;
            padding-top: 15px;
        }
        
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
        }
        
        @media print {
            .group-section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Dispensed Medications Report</h1>
        <h2>Pharmacist: {{ $pharmacist->name }} {{ $pharmacist->surname }}</h2>
    </div>

    <div class="report-info">
        <div class="report-info-row">
            <div class="report-info-cell report-info-label">Report Period:</div>
            <div class="report-info-cell">{{ $startDate }} to {{ $endDate }}</div>
            <div class="report-info-cell report-info-label">Grouped By:</div>
            <div class="report-info-cell">{{ ucfirst($groupBy) }}</div>
        </div>
        <div class="report-info-row">
            <div class="report-info-cell report-info-label">Generated:</div>
            <div class="report-info-cell">{{ $generatedAt }}</div>
            <div class="report-info-cell report-info-label">Pharmacist ID:</div>
            <div class="report-info-cell">{{ $pharmacist->id }}</div>
        </div>
    </div>

    <div class="summary-stats">
        <h3>Summary Statistics</h3>
        <div class="stats-grid">
            <div class="stats-row">
                <div class="stats-cell">
                    <div class="stat-value">{{ $totals['items'] }}</div>
                    <div class="stat-label">Total Items Dispensed</div>
                </div>
                <div class="stats-cell">
                    <div class="stat-value">R{{ number_format($totals['cost'], 2) }}</div>
                    <div class="stat-label">Total Value</div>
                </div>
                <div class="stats-cell">
                    <div class="stat-value">{{ $totals['patients'] }}</div>
                    <div class="stat-label">Unique Patients</div>
                </div>
                <div class="stats-cell">
                    <div class="stat-value">{{ $totals['medications'] }}</div>
                    <div class="stat-label">Unique Medications</div>
                </div>
            </div>
        </div>
    </div>

    @if($groupedData->isEmpty())
        <div class="no-data">
            <p>No dispensed medications found for the selected date range.</p>
        </div>
    @else
        @foreach($groupedData as $groupName => $items)
            <div class="group-section">
                <div class="group-header">
                    {{ $groupName }}
                    <span style="float: right; font-weight: normal;">
                        ({{ $items->count() }} {{ $items->count() === 1 ? 'item' : 'items' }})
                    </span>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Date Dispensed</th>
                            <th>Medication Name</th>
                            <th>Quantity</th>
                            <th>Patient Name</th>
                            <th>Doctor</th>
                            <th>Schedule</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($items as $item)
                            <tr>
                                <td>{{ $item->dispensed_at->format('Y-m-d H:i') }}</td>
                                <td>{{ $item->medication->name ?? 'Unknown' }}</td>
                                <td>{{ $item->quantity_dispensed }}</td>
                                <td>
                                    @if($item->prescription && $item->prescription->user)
                                        {{ $item->prescription->user->name }} {{ $item->prescription->user->surname }}
                                    @else
                                        Unknown Patient
                                    @endif
                                </td>
                                <td>
                                    @if($item->prescription && $item->prescription->doctor)
                                        {{ $item->prescription->doctor->name }}
                                    @else
                                        Unknown Doctor
                                    @endif
                                </td>
                                <td>Schedule {{ $item->medication->schedule ?? 'N/A' }}</td>
                                <td>R{{ number_format($item->cost, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <div class="group-summary">
                    <strong>Group Total:</strong> 
                    {{ $items->count() }} {{ $items->count() === 1 ? 'item' : 'items' }} dispensed, 
                    Total Value: R{{ number_format($items->sum('cost'), 2) }}
                </div>
            </div>
        @endforeach
    @endif

    <div class="footer">
        <p>This report was generated on {{ $generatedAt }} by the ePrescription System</p>
        <p>Pharmacist: {{ $pharmacist->name }} {{ $pharmacist->surname }} (ID: {{ $pharmacist->id }})</p>
    </div>
</body>
</html>
