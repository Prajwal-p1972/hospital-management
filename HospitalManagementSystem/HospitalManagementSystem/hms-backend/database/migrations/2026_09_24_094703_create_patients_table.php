<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {

            // Primary Key
            $table->id();

            // Unique Patient ID
            $table->string('patient_id')->unique();

            // QR Code / Lookup Token
            $table->string('qr_token')->unique()->nullable();

            // Demographics
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();

            $table->date('date_of_birth')->nullable();

            $table->enum('sex', [
                'male',
                'female',
                'other',
                'prefer_not_to_say'
            ])->nullable();

            $table->string('blood_group')->nullable();

            $table->string('photo')->nullable();

            $table->string('nationality')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('occupation')->nullable();

            // Contact Information
            $table->string('primary_phone');
            $table->string('alternate_phone')->nullable();
            $table->string('email')->nullable();

            // Address
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->string('postal_code')->nullable();

            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relationship')->nullable();

            // Patient Type
            $table->enum('patient_type', [
                'new',
                'returning',
                'referral',
                'emergency',
                'opd',
                'ipd',
                'corporate_insurance',
                'walk_in',
                'teleconsultation'
            ])->default('new');

            // Alerts / Clinical Safety
            $table->text('allergies')->nullable();
            $table->text('critical_alerts')->nullable();
            $table->text('infection_precautions')->nullable();
            $table->text('clinical_safety_flags')->nullable();

            // Consent & Communication Preferences
            $table->boolean('consent_given')->default(false);
            $table->json('communication_preferences')->nullable();

            // Configurable identifiers
            $table->json('identifiers')->nullable();

            // Configurable demographic fields
            $table->json('custom_demographics')->nullable();

            // Record status
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};