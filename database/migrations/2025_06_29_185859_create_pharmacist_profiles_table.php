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
        Schema::create('pharmacist_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('surname')->nullable();
            $table->string('id_number')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('registration_number')->nullable();
            $table->date('registration_date')->nullable();
            $table->text('bio')->nullable();
            $table->string('avatar')->nullable();
            $table->json('specializations')->nullable();
            $table->json('certifications')->nullable();
            $table->string('qualification')->nullable();
            $table->string('university')->nullable();
            $table->year('graduation_year')->nullable();
            $table->integer('years_experience')->nullable();
            $table->json('languages')->nullable();
            $table->string('license_status')->default('active');
            $table->date('license_expiry')->nullable();
            $table->timestamps();
            
            // Ensure one profile per user
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacist_profiles');
    }
};
