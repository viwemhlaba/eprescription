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
        Schema::create('active_ingredient_medication', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medication_id')->constrained()->onDelete('no action'); // Changed to 'no action'
            $table->foreignId('active_ingredient_id')->constrained()->onDelete('no action'); // Changed to 'no action'
            $table->string('strength'); // e.g., "500mg"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('active_ingredient_medication');
    }
};
