<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Database\Factories\DispensedItemFactory;

class DispensedItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'prescription_id',
        'prescription_item_id', 
        'medication_id',
        'pharmacist_id',
        'quantity_dispensed',
        'cost',
        'notes',
        'dispensed_at',
    ];

    protected $casts = [
        'dispensed_at' => 'datetime',
        'cost' => 'decimal:2',
    ];

    protected static function newFactory()
    {
        return DispensedItemFactory::new();
    }

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Customer\Prescription::class);
    }

    public function prescriptionItem(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Customer\PrescriptionItem::class);
    }

    public function medication(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Medication\Medication::class);
    }

    public function pharmacist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pharmacist_id');
    }
}
