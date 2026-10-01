<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investigations', function (Blueprint $table) {
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

            $table->string('investigation_name');

            $table->string('test_code')->nullable();

            $table->enum('investigation_type', [
                'lab',
                'imaging',
                'other'
            ])->default('lab');

            $table->enum('status', [
                'ordered',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('ordered');

            $table->date('ordered_on');

            $table->date('completed_on')->nullable();

            $table->text('result')->nullable();

            $table->text('remarks')->nullable();

            $table->timestamps();

            $table->index([
                'patient_id',
                'ordered_on'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investigations');
    }
};