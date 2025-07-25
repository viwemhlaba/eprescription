<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Customer;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing customers that don't have proper details
        $customersWithoutIdNumber = Customer::whereNull('id_number')->orWhere('id_number', '')->get();
        
        $states = [
            'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
            'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
        ];
        
        $allergies = ['None', 'Peanuts', 'Dust', 'Pollen'];
        
        foreach ($customersWithoutIdNumber as $index => $customer) {
            $customer->update([
                'id_number' => $customer->id_number ?: str_pad((string)(8000000000 + $customer->id + $index), 10, '0', STR_PAD_LEFT),
                'cellphone_number' => $customer->cellphone_number ?: '+27' . str_pad((string)(600000000 + $customer->id), 9, '0', STR_PAD_LEFT),
                'allergies' => $customer->allergies ?: $allergies[($customer->id % count($allergies))],
                'state' => $customer->state ?: $states[($customer->id % count($states))],
                'city' => $customer->city ?: 'City ' . $customer->id,
                'street' => $customer->street ?: 'Street ' . $customer->id,
                'house_number' => $customer->house_number ?: (string)($customer->id % 999 + 1),
                'postal_code' => $customer->postal_code ?: str_pad((string)(1000 + ($customer->id % 8999)), 4, '0', STR_PAD_LEFT),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to reverse
    }
};
