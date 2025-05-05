<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model
{
    use SoftDeletes;
    protected $table = 'doctors';

    protected $fillable = ['name', 'surname', 'email', 'phone', 'practice_number'];

}
