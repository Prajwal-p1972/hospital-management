<?php

namespace App\Http\Controllers;

use App\Models\ElectronicSignature;
use Illuminate\Http\Request;

class ElectronicSignatureController extends Controller
{
    // List all electronic signatures
    public function index()
    {
        $signatures = ElectronicSignature::with([
            'doctor',
            'document'
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Electronic signatures retrieved successfully',
            'data' => $signatures
        ], 200);
    }

    // Create electronic signature
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'document_id' => 'nullable|exists:documents,id',
            'signature_type' => 'nullable|string|max:255',
            'signature_data' => 'required|string',
            'signed_by' => 'required|string|max:255',
            'signed_at' => 'required|date',
            'status' => 'nullable|string|max:255',
        ]);

        $signature = ElectronicSignature::create([
            'doctor_id' => $validated['doctor_id'],
            'document_id' => $validated['document_id'] ?? null,
            'signature_type' => $validated['signature_type'] ?? 'digital',
            'signature_data' => $validated['signature_data'],
            'signed_by' => $validated['signed_by'],
            'signed_at' => $validated['signed_at'],
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Electronic signature created successfully',
            'data' => $signature
        ], 201);
    }

    // Show single electronic signature
    public function show(string $id)
    {
        $signature = ElectronicSignature::with([
            'doctor',
            'document'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Electronic signature retrieved successfully',
            'data' => $signature
        ], 200);
    }

    // Update electronic signature
    public function update(Request $request, string $id)
    {
        $signature = ElectronicSignature::findOrFail($id);

        $validated = $request->validate([
            'document_id' => 'nullable|exists:documents,id',
            'signature_type' => 'sometimes|string|max:255',
            'signature_data' => 'sometimes|string',
            'signed_by' => 'sometimes|string|max:255',
            'signed_at' => 'sometimes|date',
            'status' => 'sometimes|string|max:255',
        ]);

        $signature->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Electronic signature updated successfully',
            'data' => $signature->fresh()
        ], 200);
    }

    // Delete electronic signature
    public function destroy(string $id)
    {
        $signature = ElectronicSignature::findOrFail($id);

        $signature->delete();

        return response()->json([
            'success' => true,
            'message' => 'Electronic signature deleted successfully'
        ], 200);
    }
}