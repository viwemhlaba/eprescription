<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Medication\Medication;


class PrescriptionItem extends Model
{
    use SoftDeletes;
    protected $table = 'prescription_items';

    protected $fillable = [
        'prescription_id',
        'medication_id',
        'quantity',
        'instructions',
        'repeats',
        'price',
    ];

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }

    public function medication()
    {
        return $this->belongsTo(Medication::class);
    }
}
