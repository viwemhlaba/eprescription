<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Doctor;
use App\Models\Customer;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'file_path',
        'status',
        'name',
        'notes',
        'repeats_total',
        'repeats_used',
        'next_repeat_date',
        'delivery_method',
        'is_manual',
        'doctor_id',
        'patient_id_number',
        'reason_for_rejection',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function items()
    {
        return $this->hasMany(PrescriptionItem::class);
    }

    /**
     * Calculate the total due amount for this prescription
     */
    public function getTotalDueAttribute()
    {
        return $this->items->sum('price');
    }

    /**
     * Get formatted total due amount
     */
    public function getFormattedTotalDueAttribute()
    {
        return 'R ' . number_format($this->total_due, 2);
    }
}
