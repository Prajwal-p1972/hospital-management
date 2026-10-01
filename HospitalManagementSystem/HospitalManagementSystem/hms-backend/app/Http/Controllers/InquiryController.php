<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    // Get all inquiries
    public function index()
    {
        $inquiries = Inquiry::orderBy('created_at', 'desc')->get();
        return response()->json([
            'message' => 'Inquiries retrieved successfully',
            'data' => $inquiries
        ], 200);
    }

    // Create inquiry
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'nullable|email',
            'source' => 'nullable|string',
            'department' => 'nullable|string',
            'preferred_doctor' => 'nullable|string',
            'preferred_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
            'follow_up_owner' => 'nullable|string',
        ]);

        $inquiry = Inquiry::create($validated);

        return response()->json([
            'message' => 'Inquiry created successfully',
            'data' => $inquiry
        ], 201);
    }

    // Get inquiry by ID
    public function show($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        return response()->json([
            'message' => 'Inquiry retrieved successfully',
            'data' => $inquiry
        ], 200);
    }

    // Update inquiry
    public function update(Request $request, $id)
    {
        $inquiry = Inquiry::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email',
            'source' => 'nullable|string',
            'department' => 'nullable|string',
            'preferred_doctor' => 'nullable|string',
            'preferred_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
            'follow_up_owner' => 'nullable|string',
        ]);

        $inquiry->update($validated);

        return response()->json([
            'message' => 'Inquiry updated successfully',
            'data' => $inquiry
        ], 200);
    }

    // Delete inquiry
    public function destroy($id)
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->delete();

        return response()->json([
            'message' => 'Inquiry deleted successfully'
        ], 200);
    }
}
