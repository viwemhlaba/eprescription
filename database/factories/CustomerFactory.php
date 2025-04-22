<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'id_number' => $this->faker->unique()->numerify('##########'),
            'cellphone_number' => $this->faker->phoneNumber(),
            'allergies' => $this->faker->randomElement(['None', 'Peanuts', 'Dust', 'Pollen']),
            'state' => $this->faker->randomElement([
                'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
                'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape',
            ]),
            'city' => $this->faker->city(),
            'street' => $this->faker->streetName(),
            'house_number' => $this->faker->buildingNumber(),
            'postal_code' => $this->faker->postcode(),
        ];
    }
}
