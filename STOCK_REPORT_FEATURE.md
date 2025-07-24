# Stock Report Generation

## Overview
The stock report feature allows pharmacy managers to generate detailed PDF reports of medication inventory. These reports are ideal for stock-taking activities and inventory management.

## Features

### Report Grouping Options
- **Dosage Form**: Groups medications by their dosage form (tablets, capsules, liquid, etc.)
- **Schedule**: Groups medications by their controlled substance schedule
- **Supplier**: Groups medications by their supplier/manufacturer

### Filter Options
- **All Medications**: Include all medications in the report
- **Low Stock Only**: Only include medications where quantity on hand ≤ reorder level
- **Out of Stock Only**: Only include medications with zero quantity on hand

### Sorting Options
- **Medication Name**: Sort alphabetically by medication name
- **Quantity on Hand**: Sort by current stock quantity
- **Reorder Level**: Sort by reorder threshold level

### Additional Options
- **Include Zero Stock**: Choose whether to include medications with zero quantity

## Generated Report Contents

Each report includes:

1. **Summary Statistics**
   - Total number of medications
   - Total stock value (in currency)
   - Count of low stock items
   - Count of out of stock items

2. **Grouped Medication Data**
   - Medications organized by selected grouping method
   - For each medication:
     - Name and schedule
     - Quantity on hand and reorder level
     - Unit price and total stock value
     - Stock status (OK, Low, Out)
     - Active ingredients with strengths
     - Supplier information

3. **Complete Medication List**
   - Comprehensive table of all medications
   - Sorted according to selected criteria

## Usage Instructions

1. **Access Reports**: Navigate to Manager → Reports → Stock Reports
2. **Configure Parameters**: 
   - Select grouping method
   - Choose stock filter
   - Set sorting preferences
   - Toggle zero stock inclusion if needed
3. **Generate Report**: Click "Generate PDF Report"
4. **Download**: Report will download automatically or can be accessed from recent reports list

## Report Storage

- Reports are stored securely and linked to the generating user
- Recent reports are available for re-download
- Reports include metadata for easy identification
- File management ensures efficient storage usage

## Use Cases

### Stock Taking
- Generate "All Medications" report grouped by "Supplier"
- Print and use for physical inventory verification
- Include zero stock items for complete verification

### Reorder Planning
- Generate "Low Stock Only" report grouped by "Supplier"
- Identify medications needing reordering
- Plan purchase orders by supplier

### Inventory Analysis
- Generate comprehensive reports for management review
- Analyze stock values by category
- Monitor inventory turnover patterns

## Technical Notes

- Reports are generated as PDF files using DomPDF
- All currency values are in local currency format
- Active ingredients include strength information when available
- Stock status is automatically calculated based on reorder levels
