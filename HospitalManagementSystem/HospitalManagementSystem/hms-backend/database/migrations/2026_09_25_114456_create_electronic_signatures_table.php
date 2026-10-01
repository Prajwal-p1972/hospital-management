<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('electronic_signatures', function (Blueprint $table) {
            $table->id();

            $table->foreignId('doctor_id')
                ->constrained('doctors')
                ->cascadeOnDelete();

            $table->foreignId('document_id')
                ->nullable()
                ->constrained('documents')
                ->nullOnDelete();

            $table->string('signature_type')->default('digital');

            $table->text('signature_data');

            $table->string('signed_by');

            $table->timestamp('signed_at');

            $table->string('status')->default('active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('electronic_signatures');
    }
};