<?php

namespace App\Models\Medication;

use Illuminate\Database\Eloquent\Model;
use App\Models\Medication\Medication;
use Illuminate\Database\Eloquent\SoftDeletes;

class DosageForm extends Model
{
    use SoftDeletes;
    protected $table = 'dosage_forms';

    protected $fillable = ['name'];

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }
    
}
