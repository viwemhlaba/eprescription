<?php

namespace App\Models\Customer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use Illuminate\Database\Eloquent\SoftDeletes;
use Database\Factories\OrderFactory;

class Order extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'orders';

    protected $fillable = [
        'customer_id',
        'order_date',
        'status',
        'total_amount_due',
    ];

    public static function newFactory()
    {
        return OrderFactory::new();
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

}
