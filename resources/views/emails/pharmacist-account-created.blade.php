<x-mail::message>
# Welcome, {{ $name }}!

Your pharmacist account has been successfully created.

Here are your login details:

**Email:** {{ $email }}
**Temporary Password:** {{ $password }}

Please log in using the button below and remember to change your password immediately for security reasons.

<x-mail::button :url="$loginUrl">
Login to Your Account
</x-mail::button>

If you have any questions, feel free to contact us.

Thank you,
{{ config('app.name') }} Team
</x-mail::message>