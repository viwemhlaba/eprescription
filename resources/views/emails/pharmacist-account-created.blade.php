<x-mail::message>
# Welcome, {{ $name }}!

Your pharmacist account has been successfully created.

Here are your login details:

**Email:** {{ $email }}
**Temporary Password:** {{ $password }}

<x-mail::button :url="$loginUrl">
Login to Your Account
</x-mail::button>

**Important:** 
- For your security, you will be required to change your password when you first log in.
- After logging in, you will need to complete your profile before accessing the system features.

If you have any questions, feel free to contact us.

Thank you,
{{ config('app.name') }} Team
</x-mail::message>