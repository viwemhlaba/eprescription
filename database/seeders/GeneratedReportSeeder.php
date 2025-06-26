<?php

namespace Database\Seeders;

use App\Models\GeneratedReport;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class GeneratedReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find a pharmacist user or create one
        $pharmacist = User::where('role', 'pharmacist')->first();
        
        if (!$pharmacist) {
            $this->command->warn('No pharmacist found. Creating a sample pharmacist user.');
            $pharmacist = User::create([
                'name' => 'Sample',
                'surname' => 'Pharmacist',
                'email' => 'pharmacist@example.com',
                'password' => bcrypt('password'),
                'role' => 'pharmacist',
                'email_verified_at' => now(),
            ]);
        }

        // Create sample report records
        $reports = [
            [
                'title' => 'Dispensed Medications Report (Patient) - 2025-06-01 to 2025-06-15',
                'parameters' => [
                    'start_date' => '2025-06-01',
                    'end_date' => '2025-06-15',
                    'group_by' => 'patient'
                ],
                'generated_at' => now()->subDays(5),
            ],
            [
                'title' => 'Dispensed Medications Report (Medication) - 2025-06-10 to 2025-06-20',
                'parameters' => [
                    'start_date' => '2025-06-10',
                    'end_date' => '2025-06-20',
                    'group_by' => 'medication'
                ],
                'generated_at' => now()->subDays(2),
            ],
            [
                'title' => 'Dispensed Medications Report (Schedule) - 2025-05-01 to 2025-05-31',
                'parameters' => [
                    'start_date' => '2025-05-01',
                    'end_date' => '2025-05-31',
                    'group_by' => 'schedule'
                ],
                'generated_at' => now()->subDays(10),
            ],
        ];

        foreach ($reports as $reportData) {
            $filename = sprintf(
                'dispensed-medications-report-%s-%s-%s.pdf',
                $reportData['parameters']['group_by'],
                $reportData['parameters']['start_date'],
                $reportData['parameters']['end_date']
            );

            $storagePath = 'reports/pharmacist/' . $pharmacist->id . '/' . $filename;

            // Create a dummy PDF content
            $dummyPdfContent = '%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
50 750 Td
(Sample Report Content) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000198 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
294
%%EOF';

            // Store the dummy PDF
            Storage::disk('public')->put($storagePath, $dummyPdfContent);

            GeneratedReport::create([
                'user_id' => $pharmacist->id,
                'report_type' => 'dispensed_medications',
                'title' => $reportData['title'],
                'parameters' => $reportData['parameters'],
                'file_path' => $storagePath,
                'original_filename' => $filename,
                'file_size' => strlen($dummyPdfContent),
                'generated_at' => $reportData['generated_at'],
                'expires_at' => $reportData['generated_at']->addDays(30),
                'download_count' => rand(0, 5),
            ]);
        }

        $this->command->info('Sample generated reports created successfully!');
        $this->command->info("Pharmacist: {$pharmacist->email}");
    }
}
