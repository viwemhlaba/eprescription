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
        Schema::table('medications', function (Blueprint $table) {
            // Add the column
            $table->foreignId('active_ingredient_id')->nullable()->constrained('active_ingredients')->onDelete('set null');
            // Or if it should not be nullable and there's no active_ingredients table yet (unlikely):
            // $table->unsignedBigInteger('active_ingredient_id')->after('name'); // Adjust 'after' as needed

            // If you add it and it's not nullable, you might need to provide a default value
            // or ensure existing data is handled if you run this on a populated table.

            // If it's a foreign key, make sure the 'active_ingredients' table exists first.
            // If you don't have an 'active_ingredients' table, you'll need to create one first.
            // If it's not a foreign key, just use: $table->unsignedBigInteger('active_ingredient_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('medications', function (Blueprint $table) {
            // Only drop if the column exists
            if (Schema::hasColumn('medications', 'active_ingredient_id')) {
                try {
                    $table->dropConstrainedForeignId('active_ingredient_id');
                } catch (\Exception $e) {
                    // Ignore if already dropped
                }
                try {
                    $table->dropColumn('active_ingredient_id');
                } catch (\Exception $e) {
                    // Ignore if already dropped
                }
            }
        });
    }
};