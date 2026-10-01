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
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();

            // User account relation
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Doctor basic information
            $table->string('doctor_code')->unique();
            $table->string('registration_number')->nullable()->unique();

            $table->string('first_name');
            $table->string('last_name')->nullable();

            // Professional information
            $table->string('department')->nullable();
            $table->string('specialization')->nullable();
            $table->string('qualification')->nullable();
            $table->unsignedSmallInteger('experience_years')->nullable();

            // Contact information
            $table->string('phone')->nullable();
            $table->string('email')->nullable();

            // Consultation
            $table->decimal('consultation_fee', 10, 2)->nullable();

            // Status
            $table->enum('status', [
                'active',
                'inactive',
                'on_leave'
            ])->default('active');

            // Additional information
            $table->text('bio')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};
