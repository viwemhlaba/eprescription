<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:import {file=clean_export.sql}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import SQL file to database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file');
        
        if (!file_exists($file)) {
            $this->error("File {$file} not found!");
            return 1;
        }

        $this->info("Importing {$file}...");
        
        $sql = file_get_contents($file);
        
        // Remove comments and split by semicolon
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            function($statement) {
                return !empty($statement) && 
                       !str_starts_with($statement, '--') && 
                       !str_starts_with($statement, '/*');
            }
        );

        $bar = $this->output->createProgressBar(count($statements));
        $bar->start();

        foreach ($statements as $statement) {
            if (trim($statement)) {
                try {
                    DB::unprepared($statement);
                } catch (\Exception $e) {
                    $this->error("\nError executing: " . substr($statement, 0, 100) . "...");
                    $this->error($e->getMessage());
                }
            }
            $bar->advance();
        }

        $bar->finish();
        $this->info("\nDatabase import completed!");
        
        return 0;
    }
}
