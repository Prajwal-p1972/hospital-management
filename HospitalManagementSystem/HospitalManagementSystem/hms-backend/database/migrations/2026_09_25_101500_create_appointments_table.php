<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('patient_id')
                  ->constrained('patients')
                  ->cascadeOnDelete();

            $table->foreignId('doctor_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->date('appointment_date');
            $table->time('appointment_time');

            $table->string('appointment_type')->default('consultation');

            $table->enum('status', [
                'scheduled',
                'confirmed',
                'completed',
                'cancelled',
                'no_show'
            ])->default('scheduled');

            $table->text('reason')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};