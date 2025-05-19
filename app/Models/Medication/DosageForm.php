<?php

namespace App\Models\Medication;

use Illuminate\Database\Eloquent\Model;
use App\Models\Medication\Medication;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\DosageFormFactory;

class DosageForm extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'dosage_forms';

    protected $fillable = ['name'];

    protected static function newFactory()
    {
        return DosageFormFactory::new();
    }


    public function medications()
    {
        return $this->hasMany(Medication::class);
    }
    
}
