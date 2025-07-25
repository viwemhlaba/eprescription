<?php

namespace Tests\Feature;

use App\Models\Medication\Medication;
use App\Models\Medication\DosageForm;
use App\Models\Medication\ActiveIngredient;
use App\Models\MedicationSupplier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MedicationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\RoleSeeder']);
    }

    public function test_manager_can_store_medication()
    {
        $user = User::factory()->create(['role' => 'manager']);
        $user->assignRole('manager'); // Also assign Spatie role
        
        $dosageForm = DosageForm::factory()->create();
        $supplier = MedicationSupplier::factory()->create();
        $ingredient = ActiveIngredient::factory()->create();

        $response = $this->actingAs($user)->post(route('manager.medications.store'), [
            'name' => 'TestMed',
            'dosage_form_id' => $dosageForm->id,
            'schedule' => 1,
            'current_sale_price' => 99.99,
            'supplier_id' => $supplier->id,
            'reorder_level' => 10,
            'quantity_on_hand' => 100,
            'active_ingredients' => [
                ['id' => $ingredient->id, 'strength' => '500mg']
            ],
        ]);

        $response->assertRedirect(route('manager.medications.index'));
        $response->assertSessionHas('success', 'Medication added successfully!');
        $this->assertDatabaseHas('medications', ['name' => 'TestMed']);
        $this->assertDatabaseHas('active_ingredient_medication', [
            'strength' => '500mg',
        ]);
    }

    public function test_manager_can_update_medication()
    {
        $user = User::factory()->create(['role' => 'manager']);
        $medication = Medication::factory()->create();
        $ingredient = ActiveIngredient::factory()->create();

        $response = $this->actingAs($user)->put(route('manager.medications.update', $medication->id), [
            'name' => 'UpdatedMed',
            'dosage_form_id' => $medication->dosage_form_id,
            'schedule' => 2,
            'current_sale_price' => 49.99,
            'supplier_id' => $medication->supplier_id,
            'reorder_level' => 5,
            'quantity_on_hand' => 50,
            'active_ingredients' => [
                ['id' => $ingredient->id, 'strength' => '250mg']
            ],
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('medications', ['name' => 'UpdatedMed']);
        $this->assertDatabaseHas('active_ingredient_medication', [
            'strength' => '250mg',
        ]);
    }

    public function test_manager_can_destroy_medication()
    {
        $user = User::factory()->create(['role' => 'manager']);
        $medication = Medication::factory()->create();

        $response = $this->actingAs($user)->delete(route('manager.medications.destroy', $medication->id));
        $response->assertStatus(204);
        $this->assertSoftDeleted('medications', ['id' => $medication->id]);
    }
}
