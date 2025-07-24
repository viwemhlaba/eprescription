<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Report - {{ ucfirst(str_replace('_', ' ', $groupBy)) }}</title>
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
        .report-title {
            font-size: 24px;
            font-weight: bold;
            color: #1e40af;
            margin: 0 0 5px 0;
        }
        .report-subtitle {
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
            margin-bottom: 15px;
            font-size: 10px;
        }
        .table th {
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 6px;
            text-align: left;
            font-weight: bold;
            color: #374151;
        }
        .table td {
            border: 1px solid #d1d5db;
            padding: 6px;
            vertical-align: top;
        }
        .table tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .group-header {
            background-color: #e5e7eb;
            font-weight: bold;
            color: #1f2937;
            border: 2px solid #9ca3af;
            padding: 8px;
            margin-top: 15px;
        }
        .summary-box {
            background-color: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 15px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }
        .summary-item {
            text-align: center;
        }
        .summary-number {
            font-size: 18px;
            font-weight: bold;
            color: #0ea5e9;
        }
        .summary-label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-low {
            background-color: #fef3c7;
            color: #92400e;
        }
        .status-out {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .status-ok {
            background-color: #d1fae5;
            color: #065f46;
        }
        .page-break {
            page-break-before: always;
        }
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            padding: 5px;
            background-color: white;
        }
        .currency {
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="footer">
        Stock Report - Generated on {{ $generatedAt }} by {{ $manager->name }} {{ $manager->surname }}
    </div>

    <div class="header">
        <div class="report-title">Medication Stock Report</div>
        <div class="report-subtitle">Grouped by {{ ucfirst(str_replace('_', ' ', $groupBy)) }}</div>
    </div>

    <!-- Report Parameters -->
    <div class="section">
        <div class="section-title">Report Parameters</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Grouping:</span>
                <span class="info-value">{{ ucfirst(str_replace('_', ' ', $groupBy)) }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Filter:</span>
                <span class="info-value">{{ ucfirst(str_replace('_', ' ', $stockFilter)) }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Sort by:</span>
                <span class="info-value">{{ ucfirst(str_replace('_', ' ', $sortBy)) }} ({{ strtoupper($sortDirection) }})</span>
            </div>
            <div class="info-item">
                <span class="info-label">Zero Stock:</span>
                <span class="info-value">{{ $includeZeroStock ? 'Included' : 'Excluded' }}</span>
            </div>
        </div>
    </div>

    <!-- Summary Statistics -->
    <div class="section">
        <div class="section-title">Summary Statistics</div>
        <div class="summary-box">
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-number">{{ $totals['medications'] }}</div>
                    <div class="summary-label">Total Medications</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number currency">R{{ number_format($totals['stock_value'], 2) }}</div>
                    <div class="summary-label">Total Stock Value</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">{{ $totals['low_stock'] }}</div>
                    <div class="summary-label">Low Stock Items</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">{{ $totals['out_of_stock'] }}</div>
                    <div class="summary-label">Out of Stock</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Grouped Data -->
    @foreach($groupedData as $groupName => $group)
        <div class="section">
            <div class="group-header">
                {{ $group['name'] }} ({{ $group['count'] }} items - R{{ number_format($group['total_value'], 2) }} value - {{ $group['low_stock_count'] }} low stock)
            </div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th style="width: 25%;">Medication Name</th>
                        <th style="width: 12%;">Schedule</th>
                        <th style="width: 10%;">Qty on Hand</th>
                        <th style="width: 10%;">Reorder Level</th>
                        <th style="width: 10%;">Unit Price</th>
                        <th style="width: 10%;">Stock Value</th>
                        <th style="width: 8%;">Status</th>
                        <th style="width: 15%;">Active Ingredients</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($group['items'] as $medication)
                        <tr>
                            <td><strong>{{ $medication->name }}</strong></td>
                            <td>{{ $medication->schedule ?: 'Unscheduled' }}</td>
                            <td style="text-align: right;">{{ $medication->quantity_on_hand }}</td>
                            <td style="text-align: right;">{{ $medication->reorder_level }}</td>
                            <td style="text-align: right;" class="currency">R{{ number_format($medication->current_sale_price, 2) }}</td>
                            <td style="text-align: right;" class="currency">R{{ number_format($medication->quantity_on_hand * $medication->current_sale_price, 2) }}</td>
                            <td style="text-align: center;">
                                @if($medication->quantity_on_hand == 0)
                                    <span class="status-badge status-out">Out</span>
                                @elseif($medication->quantity_on_hand <= $medication->reorder_level)
                                    <span class="status-badge status-low">Low</span>
                                @else
                                    <span class="status-badge status-ok">OK</span>
                                @endif
                            </td>
                            <td>
                                @if($medication->activeIngredients && $medication->activeIngredients->count() > 0)
                                    @foreach($medication->activeIngredients as $ingredient)
                                        {{ $ingredient->name }}@if($ingredient->pivot && $ingredient->pivot->strength) ({{ $ingredient->pivot->strength }})@endif@if(!$loop->last), @endif
                                    @endforeach
                                @else
                                    <em>No active ingredients listed</em>
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        @if(!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

    <!-- Overall Summary Table -->
    <div class="section page-break">
        <div class="section-title">Complete Medication List</div>
        <table class="table">
            <thead>
                <tr>
                    <th style="width: 20%;">Medication Name</th>
                    <th style="width: 12%;">{{ ucfirst(str_replace('_', ' ', $groupBy)) }}</th>
                    <th style="width: 8%;">Schedule</th>
                    <th style="width: 8%;">Qty</th>
                    <th style="width: 8%;">Reorder</th>
                    <th style="width: 10%;">Unit Price</th>
                    <th style="width: 10%;">Stock Value</th>
                    <th style="width: 6%;">Status</th>
                    <th style="width: 18%;">Supplier</th>
                </tr>
            </thead>
            <tbody>
                @foreach($medications as $medication)
                    <tr>
                        <td><strong>{{ $medication->name }}</strong></td>
                        <td>
                            @if($groupBy === 'dosage_form')
                                {{ $medication->dosageForm ? $medication->dosageForm->name : 'N/A' }}
                            @elseif($groupBy === 'schedule')
                                {{ $medication->schedule ?: 'Unscheduled' }}
                            @elseif($groupBy === 'supplier')
                                {{ $medication->supplier ? $medication->supplier->name : 'N/A' }}
                            @endif
                        </td>
                        <td>{{ $medication->schedule ?: '-' }}</td>
                        <td style="text-align: right;">{{ $medication->quantity_on_hand }}</td>
                        <td style="text-align: right;">{{ $medication->reorder_level }}</td>
                        <td style="text-align: right;" class="currency">R{{ number_format($medication->current_sale_price, 2) }}</td>
                        <td style="text-align: right;" class="currency">R{{ number_format($medication->quantity_on_hand * $medication->current_sale_price, 2) }}</td>
                        <td style="text-align: center;">
                            @if($medication->quantity_on_hand == 0)
                                <span class="status-badge status-out">Out</span>
                            @elseif($medication->quantity_on_hand <= $medication->reorder_level)
                                <span class="status-badge status-low">Low</span>
                            @else
                                <span class="status-badge status-ok">OK</span>
                            @endif
                        </td>
                        <td>{{ $medication->supplier ? $medication->supplier->name : 'No Supplier' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Report Footer Information -->
    <div class="section">
        <div class="section-title">Report Information</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Generated by:</span>
                <span class="info-value">{{ $manager->name }} {{ $manager->surname }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Generated on:</span>
                <span class="info-value">{{ $generatedAt }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total medications reported:</span>
                <span class="info-value">{{ $totals['medications'] }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Total stock value:</span>
                <span class="info-value currency">R{{ number_format($totals['stock_value'], 2) }}</span>
            </div>
        </div>
    </div>
</body>
</html>
