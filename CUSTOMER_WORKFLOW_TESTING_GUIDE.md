# Customer Creation and Password Management Testing Guide

## Overview
This document outlines the testing procedures for the new customer creation and password management workflow implemented for pharmacists.

## Features Implemented

### 1. Customer Account Creation by Pharmacists
- Pharmacists can create customer accounts for walk-in patients
- Automatic email notification with temporary login credentials
- Required fields: name, surname, email, ID number, cellphone number

### 2. Forced Password Change on First Login
- New customers must change their password on first login
- `password_changed_at` field tracks when password was last changed
- Middleware enforces password change requirement

### 3. Manual Prescription Creation
- Pharmacists can create prescriptions manually for walk-in customers
- Integration with customer account creation workflow

### 4. Updated Prescription Loading
- "Load" button replaced with "Load Prescription"
- Only customer name passed for manual entry (not full medication list)

## File Changes Summary

### Backend Changes
- `app/Mail/CustomerAccountCreated.php` - New mail class for customer notifications
- `app/Http/Controllers/Pharmacist/PharmacistPrescriptionController.php` - Added customer creation and manual prescription methods
- `app/Http/Controllers/Settings/PasswordController.php` - Updated to set password_changed_at
- `app/Http/Controllers/Auth/NewPasswordController.php` - Updated to set password_changed_at
- `app/Http/Middleware/RequirePasswordChange.php` - New middleware for enforcing password change
- `app/Models/User.php` - Added password_changed_at to fillable and casts
- `database/migrations/2025_07_02_151624_add_password_changed_at_to_users_table.php` - New migration
- `bootstrap/app.php` - Registered new middleware
- `routes/web.php` - Added new routes for customer creation and manual prescriptions
- `routes/customer.php` - Applied password change middleware

### Frontend Changes
- `resources/js/pages/Pharmacist/Customers/Create.tsx` - New customer creation form
- `resources/js/pages/Pharmacist/Prescriptions/CreateManual.tsx` - New manual prescription form
- `resources/js/pages/Pharmacist/Prescriptions/Index.tsx` - Updated "Load" to "Load Prescription"
- `resources/js/pages/Pharmacist/Dashboard.tsx` - Added navigation links
- `resources/views/emails/customer-account-created.blade.php` - Email template

## Testing Procedures

### 1. Customer Account Creation Test

#### Steps:
1. Login as a pharmacist
2. Navigate to Dashboard → "Create Customer Account"
3. Fill in customer details:
   - First Name: "Test"
   - Last Name: "Customer"
   - Email: "test@example.com"
   - ID Number: "1234567890123"
   - Cellphone: "+27123456789"
4. Submit the form

#### Expected Results:
- Success message appears
- Customer receives email with login credentials
- New user and customer records created in database
- `password_changed_at` is NULL for new user

### 2. First Login Password Change Test

#### Steps:
1. Use credentials from customer creation email
2. Attempt to login at `/login`
3. Try to access any customer route

#### Expected Results:
- Login succeeds
- Immediately redirected to password change page
- Cannot access other routes until password is changed
- After password change, `password_changed_at` is set in database

### 3. Manual Prescription Creation Test

#### Steps:
1. Login as pharmacist
2. Navigate to Dashboard → "Create Manual Prescription"
3. Fill prescription details:
   - Customer Name: "Test Customer"
   - Prescription Name: "Test Prescription"
   - Add medications and quantities
4. Submit the form

#### Expected Results:
- Prescription created successfully
- Customer can see prescription in their account
- Prescription marked as "manual" type

### 4. Load Prescription Test

#### Steps:
1. Login as pharmacist
2. Go to Prescriptions list
3. Click "Load Prescription" button

#### Expected Results:
- Button text shows "Load Prescription" instead of "Load"
- Only customer name is pre-filled, not medication list
- Pharmacist can manually enter medications

## Automated Testing

Run the automated test script:
```bash
php test_customer_workflow.php
```

This script tests:
- Customer account creation
- Password change tracking
- Middleware logic
- Database field updates

## Database Verification

### Check password_changed_at field exists:
```bash
php artisan tinker --execute="echo Schema::hasColumn('users', 'password_changed_at') ? 'Column exists' : 'Column missing';"
```

### Check for users requiring password change:
```sql
SELECT id, name, email, password_changed_at 
FROM users 
WHERE password_changed_at IS NULL AND role = 'customer';
```

## Email Testing

### Check mail configuration in `.env`:
```
MAIL_MAILER=smtp
MAIL_HOST=your-smtp-host
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourpharmacy.com
MAIL_FROM_NAME="Your Pharmacy"
```

### Test email sending:
```bash
php artisan queue:work
```

## Route Testing

### New Routes Added:
- `GET /pharmacist/customers/create` - Customer creation form
- `POST /pharmacist/customers` - Store new customer
- `GET /pharmacist/prescriptions/create-manual` - Manual prescription form
- `POST /pharmacist/prescriptions/manual` - Store manual prescription

### Protected Routes:
All customer routes require password change if `password_changed_at` is NULL.

## Troubleshooting

### Common Issues:

1. **Email not sending**: Check mail configuration and queue worker
2. **Middleware not working**: Verify middleware registration in `bootstrap/app.php`
3. **Database errors**: Run migrations with `php artisan migrate`
4. **Permission errors**: Check user roles and permissions

### Logs to Check:
- `storage/logs/laravel.log` - Application errors
- Mail queue status - For email delivery issues
- Browser console - For frontend JavaScript errors

## Security Considerations

1. **Temporary passwords**: Generated randomly, must be changed on first login
2. **Email validation**: Unique email addresses required
3. **ID number validation**: Unique ID numbers required
4. **Password policies**: Laravel's default password rules apply
5. **Session management**: Users logged out after password change

## Performance Notes

1. **Database indexes**: Consider adding indexes on frequently queried fields
2. **Email queues**: Use queue workers for email sending in production
3. **Cache invalidation**: Clear cache after role/permission changes

## Future Enhancements

1. **SMS notifications**: Alternative to email for credential delivery
2. **Bulk customer import**: CSV import functionality
3. **Password expiry**: Automatic password expiration policies
4. **Audit logging**: Track all customer creation and prescription activities
