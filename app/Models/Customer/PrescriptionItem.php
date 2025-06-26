<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Medication\Medication;
use Database\Factories\PrescriptionItemFactory;



class PrescriptionItem extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'prescription_items';

    protected $fillable = [
        'prescription_id',
        'medication_id',
        'quantity',
        'instructions',
        'repeats',
        'repeats_used',
        'price',
    ];

    protected static function newFactory()
    {
        return PrescriptionItemFactory::new();
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function medication()
    {
        return $this->belongsTo(Medication::class);
    }

}
