<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_encounters', function (Blueprint $table) {

            // Primary Key
            $table->id();

            // Patient Reference
            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            // Encounter Information
            $table->string('encounter_id')->unique();

            $table->enum('encounter_type', [
                'opd',
                'ipd',
                'emergency',
                'teleconsultation',
                'follow_up'
            ]);

            $table->dateTime('encounter_date');

            // Doctor Information
            $table->foreignId('doctor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Basic Clinical Information
            $table->text('chief_complaint')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('treatment')->nullable();
            $table->text('notes')->nullable();

            // Encounter Status
            $table->enum('status', [
                'scheduled',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('completed');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_encounters');
    }
};