<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Customer; // Ensure this path is correct or update it to the correct namespace
use App\Models\Customer\Prescription;
use App\Models\CustomerAllergy; // <--- ADD THIS LINE
use Illuminate\Database\Eloquent\Relations\HasMany; // Assuming a user can be a responsible pharmacist for many pharmacies
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Pharmacist; // <-- ADD THIS LINE
use App\Models\PharmacistProfile; // <-- ADD THIS LINE
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    //declaring roles
    const ROLE_CUSTOMER = 'customer';
    const ROLE_PHARMACIST = 'pharmacist';
    const ROLE_MANAGER = 'manager'; //THE PHARMACY MANAGER

    public function isCustomer(): bool
    {
        return $this->role === self::ROLE_CUSTOMER;
    }

    public function isPharmacist(): bool
    {
        return $this->role === self::ROLE_PHARMACIST;
    }

    public function isManager(): bool
    {
        return $this->role === self::ROLE_MANAGER;
    }

    public function customer()
{
    return $this->hasOne(Customer::class);
}


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }

    public function allergies()
    {
        // Assuming:
        // 1. The 'customer_allergies' table has a 'user_id' foreign key
        // 2. This 'user_id' column stores the ID of the user
        return $this->hasMany(CustomerAllergy::class, 'user_id');

        // IMPORTANT:
        // If your foreign key in the `customer_allergies` table is named something else (e.g., `customer_id`),
        // you would use:
        // return $this->hasMany(CustomerAllergy::class, 'customer_id');
        // Please adjust 'user_id' if your foreign key is different.
    }

    public function pharmaciesResponsibleFor(): HasMany
    {
        return $this->hasMany(Pharmacy::class, 'responsible_pharmacist_id');
    }

    /**
     * The pharmacies that this user manages (as a manager).
     * This establishes the many-to-many relationship with the Pharmacy model.
     */
    public function managedPharmacies(): BelongsToMany
    {
        return $this->belongsToMany(Pharmacy::class, 'pharmacy_manager', 'user_id', 'pharmacy_id')
                    ->withTimestamps(); // If your pivot table has timestamps
    }

     public function pharmacist(): HasOne
    {
        return $this->hasOne(Pharmacist::class);
    }

    /**
     * Get the pharmacist profile associated with the user
     */
    public function pharmacistProfile(): HasOne
    {
        return $this->hasOne(PharmacistProfile::class);
    }

    /**
     * Check if the user is allergic to a specific active ingredient
     */
    public function isAllergicTo($activeIngredientId)
    {
        return $this->allergies()->where('active_ingredient_id', $activeIngredientId)->exists();
    }

    /**
     * Check if the user is allergic to any active ingredients in a medication
     */
    public function isAllergicToMedication($medication)
    {
        // Get all active ingredient IDs from the medication
        $medicationIngredientIds = $medication->activeIngredients()->pluck('active_ingredients.id');
        
        // Check if user has any allergies to these ingredients
        return $this->allergies()
            ->whereIn('active_ingredient_id', $medicationIngredientIds)
            ->exists();
    }

    /**
     * Get all active ingredients the user is allergic to
     */
    public function getAllergicActiveIngredients()
    {
        return $this->belongsToMany(
            \App\Models\Medication\ActiveIngredient::class,
            'customer_allergies',
            'user_id',
            'active_ingredient_id'
        );
    }

    /**
     * Get allergy conflicts for a specific medication
     */
    public function getAllergyConflicts($medication)
    {
        $medicationIngredients = $medication->activeIngredients;
        $userAllergies = $this->getAllergicActiveIngredients;
        
        return $medicationIngredients->intersect($userAllergies);
    }
}
