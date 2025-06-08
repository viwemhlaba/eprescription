<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ActiveIngredient; // Ensure this path is correct or update it to the correct namespace
use App\Models\User; // Assuming you have a User model for customers

class CustomerAllergy extends Model
{
    use HasFactory;

    // Define the table name if it's not the plural form of the model name
    // protected $table = 'customer_allergies';

    protected $fillable = [
        'customer_id',
        'active_ingredient_id',
        // Add any other fields you have in your customer_allergies table
    ];

    /**
     * Get the customer that owns the allergy.
     */
    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id'); // Assuming 'users' table is for customers
    }

    /**
     * Get the active ingredient associated with the allergy.
     */
    public function activeIngredient()
    {
        return $this->belongsTo(ActiveIngredient::class); // Assuming you have an ActiveIngredient model
    }
}