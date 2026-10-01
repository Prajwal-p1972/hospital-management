<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('doctor_id')
                ->constrained('doctors')
                ->cascadeOnDelete();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->foreignId('consultation_id')
                ->nullable()
                ->constrained('consultations')
                ->nullOnDelete();

            $table->string('medicine_name');

            $table->string('generic_name')->nullable();

            $table->string('dosage')->nullable();

            $table->enum('route', [
                'oral',
                'iv',
                'im',
                'sc',
                'topical',
                'inhalation',
                'other'
            ])->default('oral');

            $table->string('frequency')->nullable();

            $table->string('duration')->nullable();

            $table->unsignedInteger('quantity')->nullable();

            $table->text('instructions')->nullable();

            $table->date('start_date');

            $table->date('end_date')->nullable();

            $table->enum('status', [
                'active',
                'completed',
                'discontinued'
            ])->default('active');

            $table->timestamps();

            $table->index([
                'patient_id',
                'start_date'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};