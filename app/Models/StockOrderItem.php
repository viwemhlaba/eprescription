<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'stock_order_id',
        'medication_id',
        'quantity',
    ];

    public function stockOrder()
    {
        return $this->belongsTo(StockOrder::class);
    }

    public function medication()
    {
        return $this->belongsTo(Medication\Medication::class);
    }
}
