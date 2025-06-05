<?php

namespace App\Models\Medication;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Medication\Medication;
use Database\Factories\ActiveIngredientFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ActiveIngredient extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'active_ingredients';

    protected $fillable = ['name'];

    protected static function newFactory()
    {
        return ActiveIngredientFactory::new();
    }

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }

}
