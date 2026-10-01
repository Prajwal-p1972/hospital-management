<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('procedures', function (Blueprint $table) {
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

            $table->string('procedure_name');

            $table->string('procedure_code')->nullable();

            $table->enum('procedure_type', [
                'diagnostic',
                'therapeutic',
                'surgical',
                'other'
            ])->default('other');

            $table->date('performed_on');

            $table->enum('status', [
                'planned',
                'in_progress',
                'completed',
                'cancelled'
            ])->default('planned');

            $table->text('description')->nullable();

            $table->text('findings')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index([
                'patient_id',
                'performed_on'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('procedures');
    }
};
