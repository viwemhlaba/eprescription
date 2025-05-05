<?php

namespace Database\Factories\Customer;

use App\Models\User;
use App\Models\Customer\Prescription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer\Prescription>
 */
class PrescriptionFactory extends Factory
{
    protected $model = Prescription::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->sentence(3),
            'file_path' => 'prescriptions/sample.pdf', // Use dummy file path
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'dispensed']),
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
            'repeats_total' => fake()->numberBetween(1, 6),
            'repeats_used' => fake()->numberBetween(0, 3),
            'next_repeat_date' => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
        ];
    }
}
