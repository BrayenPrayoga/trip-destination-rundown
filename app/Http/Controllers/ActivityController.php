<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActivityController extends Controller
{
    /**
     * GET /api/activities
     */
    public function index(Request $request): JsonResponse
    {
        $query = Activity::query();

        // Filter by date if provided
        if ($request->has('date')) {
            $query->whereDate('datetime', $request->date);
        }

        $activities = $query->orderBy('datetime', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $activities,
        ]);
    }

    /**
     * POST /api/activities
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'datetime'    => 'required|date',
            'maps_url'    => 'nullable|url|max:2048',
        ]);

        $activity = Activity::create($validated);

        return response()->json([
            'success' => true,
            'data'    => $activity,
            'message' => 'Kegiatan berhasil ditambahkan!',
        ], 201);
    }

    /**
     * GET /api/activities/{id}
     */
    public function show(Activity $activity): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $activity,
        ]);
    }

    /**
     * PUT /api/activities/{id}
     */
    public function update(Request $request, Activity $activity): JsonResponse
    {
        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'datetime'    => 'sometimes|required|date',
            'maps_url'    => 'nullable|url|max:2048',
        ]);

        $activity->update($validated);

        return response()->json([
            'success' => true,
            'data'    => $activity->fresh(),
            'message' => 'Kegiatan berhasil diperbarui!',
        ]);
    }

    /**
     * DELETE /api/activities/{id}
     */
    public function destroy(Activity $activity): JsonResponse
    {
        $activity->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kegiatan berhasil dihapus!',
        ]);
    }
}
