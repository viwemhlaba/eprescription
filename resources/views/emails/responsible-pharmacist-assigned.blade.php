<x-mail::message>
# Dear {{ $pharmacistName }},

This email confirms that you have been assigned as the **Responsible Pharmacist** for the following pharmacy:

**Pharmacy Name:** {{ $pharmacyName }}

You can log in to your account to view details and manage your responsibilities related to this pharmacy.

<x-mail::button :url="url('/')">
Visit Our Website
</x-mail::button>

Thank you,
{{ config('app.name') }} Team
</x-mail::message>