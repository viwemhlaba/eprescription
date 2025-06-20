<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicationSupplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_person',
        'email',
    ];

    public function medications()
    {
        return $this->hasMany(\App\Models\Medication\Medication::class, 'supplier_id');
    }
}
