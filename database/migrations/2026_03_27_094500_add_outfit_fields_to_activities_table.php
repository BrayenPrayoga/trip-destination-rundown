<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->string('outfit_top')->nullable()->after('tiktok_url');
            $table->string('outfit_bottom')->nullable()->after('outfit_top');
            $table->string('outfit_shoes')->nullable()->after('outfit_bottom');
            $table->string('outfit_image_url', 2048)->nullable()->after('outfit_shoes');
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn([
                'outfit_top',
                'outfit_bottom',
                'outfit_shoes',
                'outfit_image_url',
            ]);
        });
    }
};
