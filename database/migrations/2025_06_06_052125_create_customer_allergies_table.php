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
        Schema::create('customer_allergies', function (Blueprint $table) {
            $table->id();
            // Foreign key to link to the 'users' table (your customers)
            // It's good practice to constrain it to the 'users' table.
            $table->foreignId('user_id')
                  ->constrained('users') // Assumes your customer table is 'users'
                  ->onDelete('cascade'); // If a user is deleted, their allergies are deleted too

            // Foreign key to link to the 'active_ingredients' table
            // You might need to create this table if it doesn't exist.
            $table->foreignId('active_ingredient_id')
                  ->constrained('active_ingredients') // Assumes your active ingredients table is 'active_ingredients'
                  ->onDelete('cascade'); // If an ingredient is deleted, related allergies are deleted

            // Add a unique constraint to prevent duplicate allergies for the same user
            $table->unique(['user_id', 'active_ingredient_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_allergies');
    }
};