<?php

// app/Models/Allergy.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Allergy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function customers()
    {
        return $this->belongsToMany(Customer::class, 'allergy_customer')
            ->withTimestamps();
    }
}
