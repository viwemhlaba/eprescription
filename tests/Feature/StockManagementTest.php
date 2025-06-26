<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Medication\Medication;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StockManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $manager;
    protected User $user;
    protected Medication $medication;    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a manager user
        $this->manager = User::factory()->create(['role' => 'manager']);
        
        // Create a regular user
        $this->user = User::factory()->create(['role' => 'customer']);
        
        // Create a medication
        $this->medication = Medication::factory()->create(['quantity_on_hand' => 10]);
    }

    /** @test */
    public function manager_can_set_stock_quantity()
    {
        $this->actingAs($this->manager);

        $response = $this->patch(route('manager.medications.set-stock', $this->medication), [
            'quantity' => 50,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('medications', [
            'id' => $this->medication->id,
            'quantity_on_hand' => 50,
        ]);
    }

    /** @test */
    public function manager_can_add_to_stock_quantity()
    {
        $this->actingAs($this->manager);

        $response = $this->patch(route('manager.medications.add-stock', $this->medication), [
            'quantity' => 20,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('medications', [
            'id' => $this->medication->id,
            'quantity_on_hand' => 30, // 10 + 20
        ]);
    }

    /** @test */
    public function set_stock_validation_fails_for_negative_quantity()
    {
        $this->actingAs($this->manager);

        $response = $this->patch(route('manager.medications.set-stock', $this->medication), [
            'quantity' => -10,
        ]);

        $response->assertSessionHasErrors('quantity');
    }

    /** @test */
    public function add_stock_validation_fails_for_non_positive_quantity()
    {
        $this->actingAs($this->manager);

        $response = $this->patch(route('manager.medications.add-stock', $this->medication), [
            'quantity' => 0,
        ]);

        $response->assertSessionHasErrors('quantity');
    }

    /** @test */
    public function unauthorized_user_cannot_set_stock()
    {
        $this->actingAs($this->user);

        $response = $this->patch(route('manager.medications.set-stock', $this->medication), [
            'quantity' => 50,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function unauthorized_user_cannot_add_stock()
    {
        $this->actingAs($this->user);

        $response = $this->patch(route('manager.medications.add-stock', $this->medication), [
            'quantity' => 20,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function unauthenticated_user_cannot_set_stock()
    {
        $response = $this->patch(route('manager.medications.set-stock', $this->medication), [
            'quantity' => 50,
        ]);

        $response->assertRedirect('/login');
    }

    /** @test */
    public function unauthenticated_user_cannot_add_stock()
    {
        $response = $this->patch(route('manager.medications.add-stock', $this->medication), [
            'quantity' => 20,
        ]);

        $response->assertRedirect('/login');
    }
}
