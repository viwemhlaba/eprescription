<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Allergy;

class AllergyCustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allergies = Allergy::all();

        User::where('role', 'customer')->each(function ($customer) use ($allergies) {
            $customer->allergies()->sync(
                $allergies->random(rand(0, 2))->pluck('id')->toArray()
            );
        });
    }
}
