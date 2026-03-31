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
            'price_items_json' => 'nullable|string',
        ]);

        if ($request->hasFile('outfit_image')) {
            $path = $request->file('outfit_image')->store('outfits', 'public');
            $validated['outfit_image_url'] = Storage::url($path);
        }

        if ($request->filled('price_items_json')) {
            $validated['price_items'] = $this->parsePriceItems($request->input('price_items_json'));
        } else {
            $validated['price_items'] = [];
        }

        unset($validated['outfit_image']);
        unset($validated['price_items_json']);

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
            'price_items_json' => 'nullable|string',
        ]);

        if ($request->hasFile('outfit_image')) {
            if (!empty($activity->outfit_image_url) && str_starts_with($activity->outfit_image_url, '/storage/')) {
                $oldPath = ltrim(str_replace('/storage/', '', $activity->outfit_image_url), '/');
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('outfit_image')->store('outfits', 'public');
            $validated['outfit_image_url'] = Storage::url($path);
        }

        if ($request->has('price_items_json')) {
            $validated['price_items'] = $request->filled('price_items_json')
                ? $this->parsePriceItems($request->input('price_items_json'))
                : [];
        }

        unset($validated['outfit_image']);
        unset($validated['price_items_json']);

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

    private function parsePriceItems(string $json): array
    {
        $decoded = json_decode($json, true);
        if (!is_array($decoded)) {
            return [];
        }

        return collect($decoded)
            ->filter(fn ($item) => is_array($item))
            ->map(function ($item) {
                $description = trim((string) ($item['description'] ?? ''));
                $amount = (float) ($item['amount'] ?? 0);
                return [
                    'description' => $description,
                    'amount' => max(0, $amount),
                ];
            })
            ->filter(fn ($item) => $item['description'] !== '' || $item['amount'] > 0)
            ->values()
            ->all();
    }
}
