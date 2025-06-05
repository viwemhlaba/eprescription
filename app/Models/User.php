<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Allergy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Customer;

// Ensure this path is correct or update it to the correct namespace
use App\Models\Customer\Prescription;
use App\Models\Medication\ActiveIngredient;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    //declaring roles
    const ROLE_CUSTOMER = 'customer';
    const ROLE_PHARMACIST = 'pharmacist';
    const ROLE_MANAGER = 'manager'; //THE PHARMACY MANAGER


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
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

    public function allergies()
    {
        return $this->belongsToMany(Allergy::class);
    }

    public function activeIngredients()
    {
        return $this->belongsToMany(ActiveIngredient::class);
    }
}
