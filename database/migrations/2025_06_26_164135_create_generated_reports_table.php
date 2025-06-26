<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('generated_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Pharmacist who generated the report
            $table->string('report_type'); // 'dispensed_medications', 'prescription_summary', etc.
            $table->string('title'); // User-friendly title
            $table->json('parameters'); // Store the parameters used to generate the report
            $table->string('file_path'); // Path to the stored PDF file
            $table->string('original_filename'); // Original filename for download
            $table->integer('file_size')->nullable(); // File size in bytes
            $table->timestamp('generated_at'); // When the report was generated
            $table->timestamp('expires_at')->nullable(); // Optional expiry date for cleanup
            $table->integer('download_count')->default(0); // Track how many times it's been downloaded
            $table->timestamps();
            
            $table->index(['user_id', 'report_type']);
            $table->index(['generated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_reports');
    }
};
