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
        Schema::table('users', function (Blueprint $table) {
            $table->string('surname')->nullable()->after('name');
            $table->string('id_number')->nullable()->after('email');
            $table->string('phone_number')->nullable()->after('id_number');
            $table->string('registration_number')->nullable()->after('phone_number');
            $table->date('registration_date')->nullable()->after('registration_number');
            $table->text('bio')->nullable()->after('registration_date');
            $table->json('specializations')->nullable()->after('bio');
            $table->json('certifications')->nullable()->after('specializations');
            $table->string('avatar')->nullable()->after('certifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'surname',
                'id_number', 
                'phone_number',
                'registration_number',
                'registration_date',
                'bio',
                'specializations',
                'certifications',
                'avatar'
            ]);
        });
    }
};
