<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Add this

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // If you want to explicitly remove the default 'customer' value
            // and allow the code to always set it.
            // Note: This won't work on SQLite without dropping and re-adding the column.
            // For MySQL, PostgreSQL, this will remove the default.
            $table->string('role')->nullable()->change(); // Change to nullable and remove default

            // OR if you want to keep 'customer' as a default for users where role isn't specified
            // but ensure new pharmacists are correctly set by the controller:
            // $table->string('role')->default('customer')->change(); // Use if you need to re-apply the default.
            // The issue here is usually about the explicit assignment in the controller not overriding the DB default.
            // Making it nullable usually resolves the conflict with explicit assignments.

        });

        // After changing the schema, you might want to update existing 'customer' roles
        // that were incorrectly assigned.
        // THIS PART IS OPTIONAL: only if you have existing users you want to change.
        // Example: Set any 'customer' role that shouldn't be 'customer' to null or another default.
        // For this specific issue (newly added pharmacist defaulting to customer),
        // the above Schema::table change should be enough.
        // You can also just manually set the default in the DB.
        // For example, if you want all existing 'customer' roles to become null:
        // DB::table('users')->where('role', 'customer')->update(['role' => null]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert changes if necessary (e.g., add default 'customer' back)
            $table->string('role')->default('customer')->change();
        });
    }
};