<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class PharmacistProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pharmacy_id',
        'surname',
        'id_number',
        'phone_number',
        'registration_number',
        'registration_date',
        'bio',
        'avatar',
        'specializations',
        'certifications',
        'qualification',
        'university',
        'graduation_year',
        'years_experience',
        'languages',
        'license_status',
        'license_expiry',
        'profile_completed',
    ];

    protected $casts = [
        'specializations' => 'array',
        'certifications' => 'array',
        'languages' => 'array',
        'registration_date' => 'datetime',
        'license_expiry' => 'datetime',
        'graduation_year' => 'integer',
        'years_experience' => 'integer',
        'profile_completed' => 'boolean',
    ];

    /**
     * Get the user that owns the profile
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the pharmacy that the pharmacist works at
     */
    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }

    /**
     * Get the formatted registration date
     */
    public function getFormattedRegistrationDateAttribute()
    {
        return $this->registration_date ? $this->registration_date->format('M d, Y') : null;
    }

    /**
     * Get the formatted license expiry date
     */
    public function getFormattedLicenseExpiryAttribute()
    {
        return $this->license_expiry ? $this->license_expiry->format('M d, Y') : null;
    }

    /**
     * Check if license is expiring soon (within 30 days)
     */
    public function getLicenseExpiringSoonAttribute()
    {
        if (!$this->license_expiry) return false;
        
        $expiryDate = Carbon::parse($this->license_expiry);
        $now = Carbon::now();
        
        // Check if license expires in the future AND within 30 days
        return $expiryDate->isFuture() && $expiryDate->diffInDays($now) <= 30;
    }

    /**
     * Get years since registration
     */
    public function getYearsSinceRegistrationAttribute()
    {
        if (!$this->registration_date) return 0;
        
        return Carbon::parse($this->registration_date)->diffInYears(Carbon::now());
    }

    /**
     * Get avatar URL with fallback
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }
        
        // Generate initials-based avatar URL
        $initials = strtoupper(substr($this->user->name, 0, 1));
        if ($this->surname) {
            $initials .= strtoupper(substr($this->surname, 0, 1));
        }
        
        return "https://ui-avatars.com/api/?name={$initials}&background=3b82f6&color=fff&size=200";
    }
}
