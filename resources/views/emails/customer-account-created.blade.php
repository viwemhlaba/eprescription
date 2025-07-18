<x-mail::message>
# Welcome, {{ $name }}!

Your customer account has been created by one of our pharmacists.

Here are your login details:

**Email:** {{ $email }}
**Temporary Password:** {{ $password }}

<x-mail::button :url="$loginUrl">
Login to Your Account
</x-mail::button>

**Important:** For your security, you will be required to change your password when you first log in.

You can now view and manage your prescriptions through your online account.

If you have any questions, feel free to contact us.

Thank you,
{{ config('app.name') }} Team
</x-mail::message>
