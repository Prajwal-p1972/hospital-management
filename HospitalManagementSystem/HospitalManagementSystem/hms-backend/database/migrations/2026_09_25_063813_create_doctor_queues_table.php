<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctor_queues', function (Blueprint $table) {
            $table->id();

            $table->foreignId('doctor_id')
                ->constrained('doctors')
                ->cascadeOnDelete();

            $table->foreignId('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();

            $table->date('queue_date');

            $table->unsignedInteger('queue_number');

            $table->time('appointment_time')->nullable();

            $table->enum('status', [
                'waiting',
                'in_consultation',
                'completed',
                'cancelled',
                'no_show'
            ])->default('waiting');

            $table->string('reason')->nullable();

            $table->text('notes')->nullable();

            $table->timestamp('checked_in_at')->nullable();

            $table->timestamp('consultation_started_at')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->unique([
                'doctor_id',
                'queue_date',
                'queue_number'
            ]);

            $table->index([
                'doctor_id',
                'queue_date',
                'status'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctor_queues');
    }
};