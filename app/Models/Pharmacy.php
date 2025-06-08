<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // Import for Many-to-Many

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'health_council_registration_number',
        'physical_address',
        'contact_number',
        'email',
        'website_url',
        'responsible_pharmacist_id',
    ];

    /**
     * Get the responsible pharmacist for the pharmacy.
     */
    public function responsiblePharmacist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responsible_pharmacist_id')
            ->where('role', User::ROLE_PHARMACIST);
    }

    /**
     * The managers that manage the pharmacy.
     * This establishes the many-to-many relationship with the User model for managers.
     */
    public function managers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pharmacy_manager', 'pharmacy_id', 'user_id')
                    ->withTimestamps(); // If your pivot table has timestamps
    }
}