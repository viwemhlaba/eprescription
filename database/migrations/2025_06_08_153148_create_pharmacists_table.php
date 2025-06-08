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
        Schema::create('pharmacists', function (Blueprint $table) {
            $table->id();
            // Foreign key to the users table
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();

            // Pharmacist-specific details
            $table->string('id_number')->unique();
            $table->string('cellphone_number');
            $table->string('health_council_registration_number')->unique();

            $table->timestamps();
            $table->softDeletes(); // For soft deleting pharmacists
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacists');
    }
};