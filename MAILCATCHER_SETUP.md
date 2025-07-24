# Email Testing Setup for Development

## Current Issue
Mailtrap is limiting emails with: "550 5.7.0 Too many emails per second. Please upgrade your plan"

## Solution Options

### Option 1: MailCatcher (Recommended)

**Prerequisites:**
- Ruby must be installed on your system

**Installation:**
1. Install Ruby from: https://rubyinstaller.org/downloads/ (for Windows)
2. Open Command Prompt as Administrator
3. Install MailCatcher:
   ```bash
   gem install mailcatcher
   ```

**Usage:**
1. Start MailCatcher:
   ```bash
   mailcatcher
   ```
2. Update your `.env` file:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=127.0.0.1
   MAIL_PORT=1025
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   MAIL_FROM_ADDRESS="noreply@ibhayipharmacy.com"
   MAIL_FROM_NAME="${APP_NAME}"
   ```
3. View emails at: http://127.0.0.1:1080

### Option 2: MailHog (Alternative)

**Installation:**
1. Download MailHog from: https://github.com/mailhog/MailHog/releases
2. Extract and run the executable

**Usage:**
1. Start MailHog:
   ```bash
   ./MailHog.exe
   ```
2. Use same `.env` settings as MailCatcher
3. View emails at: http://127.0.0.1:8025

### Option 3: Docker MailCatcher

**Prerequisites:**
- Docker must be installed

**Usage:**
1. Run MailCatcher in Docker:
   ```bash
   docker run -d -p 1080:1080 -p 1025:1025 --name mailcatcher tophfr/mailcatcher
   ```
2. Use same `.env` settings as above
3. View emails at: http://127.0.0.1:1080

### Option 4: Laravel Log Driver (Current Setting)

**Current Configuration:**
```env
MAIL_MAILER=log
```

**Usage:**
- Emails are logged to `storage/logs/laravel.log`
- No web interface, but emails won't be rate-limited
- Good for testing email sending functionality

### Option 5: MailPit (Modern Alternative)

**Installation:**
1. Download from: https://github.com/axllent/mailpit/releases
2. Extract and run

**Usage:**
1. Start MailPit:
   ```bash
   ./mailpit.exe
   ```
2. Update `.env`:
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=127.0.0.1
   MAIL_PORT=1025
   MAIL_USERNAME=null
   MAIL_PASSWORD=null
   MAIL_ENCRYPTION=null
   ```
3. View emails at: http://127.0.0.1:8025

## Recommended Setup for Development

1. **For immediate testing**: Keep current `MAIL_MAILER=log` setting
2. **For email visualization**: Install MailPit (easiest) or MailCatcher
3. **For team development**: Use Docker MailCatcher

## Testing Your Setup

After configuring, test with this Artisan command:
```bash
php artisan tinker
Mail::raw('Test email', function($msg) { $msg->to('test@example.com')->subject('Test'); });
```

## Switching Back to Production

When deploying to production, update your `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=your-production-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_ENCRYPTION=tls
```
