<?php

namespace Tests\Feature\Pharmacist;

use App\Models\User;
use App\Models\Customer\Prescription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewPrescriptionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_pharmacist_can_view_pending_prescriptions()
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $customer = User::factory()->create(['role' => 'customer']);

        // Create prescriptions with different statuses
        Prescription::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending',
            'name' => 'Prescription A',
        ]);

        Prescription::factory()->create([
            'user_id' => $customer->id,
            'status' => 'loaded',
            'name' => 'Prescription B',
        ]);

        $response = $this->actingAs($pharmacist)->get(route('pharmacist.prescriptions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Pharmacist/Prescriptions/Index')
            ->has('prescriptions', 1)
            ->where('prescriptions.0.prescription_name', 'Prescription A')
        );
    }
}
