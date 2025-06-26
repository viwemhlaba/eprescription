<?php

namespace App\Console\Commands;

use App\Models\GeneratedReport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanupExpiredReports extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reports:cleanup 
                            {--days=30 : Number of days after which reports are considered expired}
                            {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up expired generated reports and their associated files';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $dryRun = $this->option('dry-run');

        // Find expired reports
        $expiredReports = GeneratedReport::where('expires_at', '<', now())
            ->orWhere('created_at', '<', now()->subDays($days))
            ->get();

        if ($expiredReports->isEmpty()) {
            $this->info('No expired reports found.');
            return;
        }

        $this->info("Found {$expiredReports->count()} expired reports.");

        if ($dryRun) {
            $this->warn('DRY RUN MODE - No files will be actually deleted');
        }

        $deletedFiles = 0;
        $deletedRecords = 0;

        foreach ($expiredReports as $report) {
            $this->line("Processing: {$report->title} (ID: {$report->id})");

            if (!$dryRun) {
                // Delete the file if it exists
                if ($report->getFileExists()) {
                    Storage::disk('public')->delete($report->file_path);
                    $deletedFiles++;
                    $this->info("  ✓ Deleted file: {$report->file_path}");
                } else {
                    $this->warn("  ⚠ File already missing: {$report->file_path}");
                }

                // Delete the database record
                $report->delete();
                $deletedRecords++;
                $this->info("  ✓ Deleted database record");
            } else {
                $this->info("  Would delete: {$report->file_path}");
                $this->info("  Would delete database record");
            }
        }

        if (!$dryRun) {
            $this->info("\nCleanup completed:");
            $this->info("  Files deleted: {$deletedFiles}");
            $this->info("  Database records deleted: {$deletedRecords}");
        } else {
            $this->warn("\nDry run completed. Use without --dry-run to actually delete files.");
        }
    }
}
