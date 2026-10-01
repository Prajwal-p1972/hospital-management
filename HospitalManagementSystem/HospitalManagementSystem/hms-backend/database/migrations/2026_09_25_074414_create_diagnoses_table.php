<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diagnoses', function (Blueprint $table) {
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

            $table->string('diagnosis_code')->nullable();

            $table->string('diagnosis_name');

            $table->enum('diagnosis_type', [
                'provisional',
                'confirmed',
                'differential'
            ])->default('provisional');

            $table->text('description')->nullable();

            $table->enum('status', [
                'active',
                'resolved',
                'inactive'
            ])->default('active');

            $table->date('diagnosed_on');

            $table->timestamps();

            $table->index([
                'patient_id',
                'diagnosed_on'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diagnoses');
    }
};