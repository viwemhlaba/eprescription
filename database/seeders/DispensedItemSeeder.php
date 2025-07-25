<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DispensedItem;
use App\Models\Customer\PrescriptionItem;
use App\Models\User;

class DispensedItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some prescription items to dispense
        $prescriptionItems = PrescriptionItem::take(20)->get();
        
        if ($prescriptionItems->isEmpty()) {
            $this->command->warn('No prescription items found to create dispensed items.');
            return;
        }

        // Get a pharmacist to dispense the items
        $pharmacist = User::where('role', 'pharmacist')->first();
        
        if (!$pharmacist) {
            $this->command->warn('No pharmacist found to dispense items.');
            return;
        }

        foreach ($prescriptionItems as $prescriptionItem) {
            // Randomly decide if this item should be dispensed (80% chance)
            if (rand(1, 100) <= 80) {
                DispensedItem::firstOrCreate([
                    'prescription_item_id' => $prescriptionItem->id,
                ], [
                    'quantity_dispensed' => min($prescriptionItem->quantity, rand(1, $prescriptionItem->quantity)),
                    'dispensed_by' => $pharmacist->id,
                    'dispensed_at' => now()->subDays(rand(0, 30)),
                    'notes' => $this->getRandomNotes(),
                ]);
            }
        }

        $this->command->info('Dispensed items seeded successfully!');
    }

    /**
     * Get random notes for dispensed items
     */
    private function getRandomNotes(): ?string
    {
        $notes = [
            'Dispensed in full',
            'Patient counselled on usage',
            'Advised to take with food',
            'Patient reminded about side effects',
            'Follow-up appointment scheduled',
            null, // Some items have no notes
            null,
            'Patient has no known allergies',
            'Medication interaction checked',
        ];

        return $notes[array_rand($notes)];
    }
}
