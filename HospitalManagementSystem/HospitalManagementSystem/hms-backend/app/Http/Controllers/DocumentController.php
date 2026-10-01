<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    // List all documents
    public function index()
    {
        $documents = Document::with([
            'patient',
            'doctor',
            'consultation'
        ])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Documents retrieved successfully',
            'data' => $documents
        ], 200);
    }

    // Upload and create document
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'consultation_id' => 'nullable|exists:consultations,id',
            'document_type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'description' => 'nullable|string',
        ]);

        $file = $request->file('file');

        $path = $file->store('documents', 'public');

        $document = Document::create([
            'patient_id' => $validated['patient_id'],
            'doctor_id' => $validated['doctor_id'] ?? null,
            'consultation_id' => $validated['consultation_id'] ?? null,
            'document_type' => $validated['document_type'],
            'title' => $validated['title'],
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'data' => $document
        ], 201);
    }

    // Show single document
    public function show(string $id)
    {
        $document = Document::with([
            'patient',
            'doctor',
            'consultation'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Document retrieved successfully',
            'data' => $document
        ], 200);
    }

    // Update document
    public function update(Request $request, string $id)
    {
        $document = Document::findOrFail($id);

        $validated = $request->validate([
            'patient_id' => 'sometimes|exists:patients,id',
            'doctor_id' => 'nullable|exists:doctors,id',
            'consultation_id' => 'nullable|exists:consultations,id',
            'document_type' => 'sometimes|string|max:255',
            'title' => 'sometimes|string|max:255',
            'file' => 'nullable|file|mimes:pdf,jpg,jpeg,png,doc,docx|max:10240',
            'description' => 'nullable|string',
        ]);

        if ($request->hasFile('file')) {
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }

            $file = $request->file('file');

            $validated['file_path'] = $file->store('documents', 'public');
            $validated['file_name'] = $file->getClientOriginalName();
            $validated['mime_type'] = $file->getClientMimeType();
            $validated['file_size'] = $file->getSize();
        }

        unset($validated['file']);

        $document->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Document updated successfully',
            'data' => $document->fresh()
        ], 200);
    }

    // Delete document
    public function destroy(string $id)
    {
        $document = Document::findOrFail($id);

        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ], 200);
    }
}