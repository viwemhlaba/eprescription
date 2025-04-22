<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class Prescription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'file_path',
        'status',
        'name',
        'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
