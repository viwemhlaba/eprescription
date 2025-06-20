<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('medications', function (Blueprint $table) {
            // Only drop if the column exists
            if (Schema::hasColumn('medications', 'active_ingredient_id')) {
                try {
                    $table->dropForeign(['active_ingredient_id']);
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

    public function down(): void
    {
        Schema::table('medications', function (Blueprint $table) {
            $table->foreignId('active_ingredient_id')
                ->constrained()
                ->onDelete('cascade');
        });
    }
};
