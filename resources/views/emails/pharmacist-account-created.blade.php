<x-mail::message>
# Welcome, {{ $name }}!

Your pharmacist account has been successfully created.

Here are your login details:

**Email:** {{ $email }}

<x-mail::button :url="$resetUrl">
Set Your Password
</x-mail::button>

For your security, please use the button above to set your password. This link will expire soon. Do not share this email or link with anyone.

If you have any questions, feel free to contact us.

Thank you,
{{ config('app.name') }} Team
</x-mail::message>