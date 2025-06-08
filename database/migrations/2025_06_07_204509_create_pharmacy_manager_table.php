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
        Schema::create('pharmacy_manager', function (Blueprint $table) {
            $table->id();
            // Foreign key to the 'pharmacies' table
            $table->foreignId('pharmacy_id')
                  ->constrained() // Assumes 'pharmacies' table, 'id' column
                  ->onDelete('cascade'); // If a pharmacy is deleted, remove its manager associations

            // Foreign key to the 'users' table (for managers)
            $table->foreignId('user_id') // Renamed from manager_id to user_id to match Laravel conventions for `belongsToMany`
                  ->constrained() // Assumes 'users' table, 'id' column
                  ->onDelete('cascade'); // If a manager user is deleted, remove their pharmacy associations

            $table->timestamps();

            // Ensure a manager can only be linked to a specific pharmacy once
            $table->unique(['pharmacy_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_manager');
    }
};