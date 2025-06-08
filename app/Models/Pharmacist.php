<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pharmacist extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'id_number',
        'cellphone_number',
        'health_council_registration_number',
    ];

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array<int, string>
     */
    protected $dates = ['deleted_at'];

    /**
     * Get the user that owns the pharmacist profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}