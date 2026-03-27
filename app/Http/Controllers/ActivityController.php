<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

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
            'end_datetime' => 'nullable|date|after_or_equal:datetime',
            'maps_url'    => 'nullable|url|max:2048',
            'tiktok_url'  => 'nullable|url|max:2048',
            'outfit_top' => 'nullable|string|max:255',
            'outfit_bottom' => 'nullable|string|max:255',
            'outfit_shoes' => 'nullable|string|max:255',
            'outfit_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($request->hasFile('outfit_image')) {
            $path = $request->file('outfit_image')->store('outfits', 'public');
            $validated['outfit_image_url'] = Storage::url($path);
        }

        unset($validated['outfit_image']);

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
            'end_datetime' => 'nullable|date|after_or_equal:datetime',
            'maps_url'    => 'nullable|url|max:2048',
            'tiktok_url'  => 'nullable|url|max:2048',
            'outfit_top' => 'nullable|string|max:255',
            'outfit_bottom' => 'nullable|string|max:255',
            'outfit_shoes' => 'nullable|string|max:255',
            'outfit_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($request->hasFile('outfit_image')) {
            if (!empty($activity->outfit_image_url) && str_starts_with($activity->outfit_image_url, '/storage/')) {
                $oldPath = ltrim(str_replace('/storage/', '', $activity->outfit_image_url), '/');
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('outfit_image')->store('outfits', 'public');
            $validated['outfit_image_url'] = Storage::url($path);
        }

        unset($validated['outfit_image']);

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
