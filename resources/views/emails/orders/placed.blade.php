<x-mail::message>
# Stock Order Placed

A new stock order has been placed successfully.

**Order Details:**
- Order ID: {{ $stockOrder->id }}
- Order Date: {{ $stockOrder->created_at->format('Y-m-d H:i:s') }}
- Status: {{ $stockOrder->status }}

<x-mail::table>
| Item | Quantity | Unit Price | Total |
|:-----|:---------|:-----------|:------|
@foreach($stockOrder->items as $item)
| {{ $item->medication->name ?? 'N/A' }} | {{ $item->quantity }} | {{ number_format($item->unit_price, 2) }} | {{ number_format($item->total_price, 2) }} |
@endforeach
</x-mail::table>

**Order Total: R{{ number_format($stockOrder->total_amount, 2) }}**

The supplier has been notified and will process your order shortly.

Thank you,<br>
{{ config('app.name') }}
</x-mail::message>
