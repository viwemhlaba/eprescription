<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
    use SoftDeletes;
    protected $table = 'order_items';
    protected $fillable = [
        'order_id',
        'prescription_id',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }
}
