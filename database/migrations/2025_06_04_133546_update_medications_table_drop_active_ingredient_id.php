<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('medications', function (Blueprint $table) {
            // First drop the foreign key, then the column
            $table->dropForeign(['active_ingredient_id']);
            $table->dropColumn('active_ingredient_id');
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
