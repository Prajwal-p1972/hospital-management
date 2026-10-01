<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('doctor_id')
                ->constrained('doctors')
                ->cascadeOnDelete();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->foreignId('queue_id')
                ->nullable()
                ->constrained('doctor_queues')
                ->nullOnDelete();

            $table->dateTime('consultation_date');

            $table->text('chief_complaint')->nullable();

            $table->text('history')->nullable();

            $table->text('examination')->nullable();

            $table->text('diagnosis')->nullable();

            $table->text('investigations')->nullable();

            $table->text('prescription')->nullable();

            $table->text('advice')->nullable();

            $table->text('procedure')->nullable();

            $table->text('follow_up')->nullable();

            $table->text('documents')->nullable();

            $table->text('electronic_signature')->nullable();

            $table->enum('status', [
                'draft',
                'completed',
                'cancelled'
            ])->default('draft');

            $table->timestamps();

            $table->index([
                'doctor_id',
                'patient_id',
                'consultation_date'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};