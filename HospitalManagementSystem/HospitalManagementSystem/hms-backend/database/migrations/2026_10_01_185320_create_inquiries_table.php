<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('source')->nullable(); // WALK_IN, WEBSITE, PHONE, REFERRAL
            $table->string('department')->nullable();
            $table->string('preferred_doctor')->nullable();
            $table->date('preferred_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->default('NEW'); // NEW, CONTACTED, BOOKED, LOST
            $table->string('follow_up_owner')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
