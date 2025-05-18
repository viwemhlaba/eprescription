<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Customer\Prescription;

class Doctor extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'doctors';

    protected $fillable = ['name', 'surname', 'email', 'phone', 'practice_number'];

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class);
    }
}
