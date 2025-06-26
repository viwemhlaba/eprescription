<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'supplier_id',
        'status',
    ];

    public static function generateOrderNumber()
    {
        $date = now()->format('Ymd');
        $latestOrder = self::where('order_number', 'like', "ORD-{$date}-%")->latest('order_number')->first();

        if ($latestOrder) {
            $lastNumber = (int) substr($latestOrder->order_number, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return "ORD-{$date}-{$newNumber}";
    }

    public function items()
    {
        return $this->hasMany(StockOrderItem::class);
    }

    public function supplier()
    {
        return $this->belongsTo(MedicationSupplier::class);
    }
}
