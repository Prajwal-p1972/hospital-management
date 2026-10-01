<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('follow_ups', function (Blueprint $table) {
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

            $table->date('follow_up_date');

            $table->string('reason')->nullable();

            $table->text('instructions')->nullable();

            $table->enum('status', [
                'scheduled',
                'completed',
                'cancelled',
                'missed'
            ])->default('scheduled');

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index([
                'patient_id',
                'follow_up_date'
            ]);

            $table->index([
                'doctor_id',
                'follow_up_date'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follow_ups');
    }
};