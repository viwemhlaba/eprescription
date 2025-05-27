<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Database\Factories\OrderItemFactory;

class OrderItem extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'order_items';
    protected $fillable = [
        'order_id',
        'prescription_id',
    ];

     public static function newFactory()
    {
        return OrderItemFactory::new();
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function prescription()
    {
        return $this->belongsTo(Prescription::class);
    }
}
