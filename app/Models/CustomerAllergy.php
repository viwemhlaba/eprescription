<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Medication\ActiveIngredient;
use App\Models\User;

class CustomerAllergy extends Model
{
    use HasFactory;

    protected $table = 'customer_allergies';

    protected $fillable = [
        'user_id',
        'active_ingredient_id',
    ];

    /**
     * Get the user (customer) that owns the allergy.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the active ingredient associated with the allergy.
     */
    public function activeIngredient()
    {
        return $this->belongsTo(ActiveIngredient::class);
    }
}