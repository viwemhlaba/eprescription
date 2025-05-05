<?php

namespace App\Models\Medication;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Customer\PrescriptionItem;

class Medication extends Model
{
    use SoftDeletes;
    protected $table = 'medications';
    protected $fillable = [
        'name',
        'dosage_form_id',
        'active_ingredient_id',
        'schedule',
        'current_sale_price',
    ];

    public function dosageForm()
    {
        return $this->belongsTo(DosageForm::class );
    }

    public function activeIngredient()
    {
        return $this->belongsTo(ActiveIngredient::class);
    }

    public function prescriptionItems()
    {
        return $this->hasMany(PrescriptionItem::class);
    }
}
