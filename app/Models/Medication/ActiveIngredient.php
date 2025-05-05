<?php

namespace App\Models\Medication;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Medication\Medication;

class ActiveIngredient extends Model
{
    use SoftDeletes;
    
    protected $table = 'active_ingredients';

    protected $fillable = ['name'];

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }
}
