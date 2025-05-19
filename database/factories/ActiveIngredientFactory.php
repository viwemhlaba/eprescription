<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Medication\ActiveIngredient;

class ActiveIngredientFactory extends Factory
{
    protected $model = ActiveIngredient::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
        ];
    }
}
