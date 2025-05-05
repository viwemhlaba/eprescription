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
        Schema::table('prescriptions', function (Blueprint $table) {
            Schema::table('prescriptions', function (Blueprint $table) {
                $table->integer('repeats_total')->default(0); // Total number of allowed repeats
                $table->integer('repeats_used')->default(0);  // How many have been used
                $table->date('next_repeat_date')->nullable(); // When the next repeat is due
            });
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('prescriptions', function (Blueprint $table) {
            $table->dropColumn(['repeats_total', 'repeats_used', 'next_repeat_date']);
        });
    }
};
