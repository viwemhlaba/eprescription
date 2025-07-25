<?php

namespace Tests\Feature\Pharmacist;

use App\Models\User;
use App\Models\Customer\Prescription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ViewPrescriptionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\RoleSeeder']);
    }

    public function test_pharmacist_can_view_pending_prescriptions()
    {
        $pharmacist = User::factory()->create(['role' => 'pharmacist']);
        $pharmacist->assignRole('pharmacist'); // Also assign Spatie role
        
        // Create a pharmacy manually
        $pharmacy = \App\Models\Pharmacy::create([
            'name' => 'Test Pharmacy',
            'health_council_registration_number' => 'REG123456',
            'physical_address' => '123 Test St',
            'contact_number' => '555-1234',
            'email' => 'test@pharmacy.com',
        ]);
        
        // Create a pharmacist profile to satisfy onboarding middleware
        \App\Models\PharmacistProfile::create([
            'user_id' => $pharmacist->id,
            'pharmacy_id' => $pharmacy->id,
            'profile_completed' => true,
        ]);
        
        $customer = User::factory()->create(['role' => 'customer']);

        // Create prescriptions with different statuses
        Prescription::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending',
            'name' => 'Prescription A',
            'file_path' => 'prescriptions/test-file.pdf', // Add file_path
            'is_manual' => false,
        ]);

        Prescription::factory()->create([
            'user_id' => $customer->id,
            'status' => 'loaded',
            'name' => 'Prescription B',
            'file_path' => 'prescriptions/test-file-2.pdf', // Add file_path
            'is_manual' => false,
        ]);

        $response = $this->actingAs($pharmacist)->get(route('pharmacist.prescriptions.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Pharmacist/Prescriptions/Index')
            ->has('uploadedPrescriptions', 1)
            ->where('uploadedPrescriptions.0.prescription_name', 'Prescription A')
            ->has('manualPrescriptions', 0)
        );
    }
}
