<x-mail::message>
# Stock Order Placed

A new stock order has been placed successfully.

**Order Details:**
- Order Number: {{ $stockOrder->order_number }}
- Order Date: {{ $stockOrder->created_at->format('F j, Y \a\t g:i A') }}
- Status: {{ $stockOrder->status }}

<x-mail::table>
| Medication | Quantity Ordered |
|:-----------|:-----------------|
@foreach($stockOrder->items as $item)
| {{ $item->medication->name ?? 'N/A' }} | {{ $item->quantity }} units |
@endforeach
</x-mail::table>

Please prepare the requested medications for delivery. Contact us if you have any questions regarding this order.

<x-mail::button :url="'#'">
View Order Details
</x-mail::button>

Thank you for your continued partnership.

Best regards,<br>
{{ config('app.name') }} Pharmacy Management
</x-mail::message>
