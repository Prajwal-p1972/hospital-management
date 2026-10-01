<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advice', function (Blueprint $table) {
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

            $table->enum('advice_type', [
                'diet',
                'lifestyle',
                'medication',
                'activity',
                'general',
                'other'
            ])->default('general');

            $table->text('advice_details');

            $table->enum('priority', [
                'low',
                'normal',
                'high'
            ])->default('normal');

            $table->date('given_on');

            $table->boolean('follow_up_required')->default(false);

            $table->date('follow_up_date')->nullable();

            $table->enum('status', [
                'active',
                'completed',
                'cancelled'
            ])->default('active');

            $table->timestamps();

            $table->index([
                'patient_id',
                'given_on'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advice');
    }
};