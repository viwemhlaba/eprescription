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
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dosage_form_id')->constrained()->onDelete('cascade');
            $table->foreignId('active_ingredient_id')->constrained()->onDelete('cascade');
            $table->string('name')->unique();
            $table->unsignedTinyInteger('schedule'); // 0–6
            $table->decimal('current_sale_price', 10, 2)->default(0);
            $table->unsignedBigInteger('supplier_id');
            $table->foreign('supplier_id')->references('id')->on('medication_suppliers')->onDelete('cascade');
            $table->integer('reorder_level');
            $table->integer('quantity_on_hand');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
