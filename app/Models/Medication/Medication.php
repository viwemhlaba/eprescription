<?php

namespace App\Models\Medication;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Customer\PrescriptionItem;
use Database\Factories\MedicationFactory;

class Medication extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'medications';

    protected $fillable = [
        'name',
        'active_ingredient_id',
        'dosage_form_id',
        'schedule',
        'current_sale_price',
    ];


    protected static function newFactory()
    {
        return MedicationFactory::new();
    }

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
