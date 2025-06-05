<?php

namespace App\Models;

use App\Models\Medication\ActiveIngredient;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customer\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'id_number',
        'cellphone_number',
        'allergies',
        'state',
        'city',
        'street',
        'house_number',
        'postal_code',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // app/Models/Customer.php
    public function allergies()
    {
        return $this->belongsToMany(Allergy::class, 'allergy_customer')
            ->withTimestamps();
    }



}
