<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Customer;
use Faker\Factory as Faker;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing customers that don't have proper details
        $faker = Faker::create();
        $customersWithoutIdNumber = Customer::whereNull('id_number')->orWhere('id_number', '')->get();
        
        foreach ($customersWithoutIdNumber as $customer) {
            $customer->update([
                'id_number' => $faker->unique()->numerify('##########'),
                'cellphone_number' => $customer->cellphone_number ?: $faker->phoneNumber(),
                'allergies' => $customer->allergies ?: $faker->randomElement(['None', 'Peanuts', 'Dust', 'Pollen']),
                'state' => $customer->state ?: $faker->randomElement([
                    'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
                    'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
                ]),
                'city' => $customer->city ?: $faker->city(),
                'street' => $customer->street ?: $faker->streetName(),
                'house_number' => $customer->house_number ?: $faker->buildingNumber(),
                'postal_code' => $customer->postal_code ?: $faker->postcode(),
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
