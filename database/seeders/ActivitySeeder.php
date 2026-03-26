<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        $activities = [
            [
                'title'       => 'Borobudur Temple',
                'description' => 'Mulai hari dengan mengunjungi Candi Borobudur saat matahari terbit. Nikmati keagungan candi Buddha terbesar di dunia ini dengan pemandangan gunung yang memukau di latar belakang.',
                'datetime'    => '2024-06-15 05:30:00',
                'maps_url'    => 'https://maps.google.com/?q=Borobudur+Temple,+Magelang',
            ],
            [
                'title'       => 'Prambanan Temple',
                'description' => 'Jelajahi kompleks Candi Prambanan, candi Hindu terbesar di Indonesia. Arsitektur yang megah dengan menara-menara tinggi menjulang akan membuatmu terpesona.',
                'datetime'    => '2024-06-15 10:00:00',
                'maps_url'    => 'https://maps.google.com/?q=Prambanan+Temple,+Yogyakarta',
            ],
            [
                'title'       => 'Malioboro Street',
                'description' => 'Berjalan di sepanjang Jalan Malioboro yang legendaris. Nikmati kuliner khas Jogja, belanja batik, dan rasakan suasana kota yang penuh kehidupan dan budaya.',
                'datetime'    => '2024-06-15 14:00:00',
                'maps_url'    => 'https://maps.google.com/?q=Malioboro+Street,+Yogyakarta',
            ],
            [
                'title'       => 'Keraton Yogyakarta',
                'description' => 'Kunjungi istana Sultan Yogyakarta yang masih berfungsi hingga hari ini. Pelajari sejarah dan budaya Jawa yang kaya melalui arsitektur dan koleksi museum yang ada di dalamnya.',
                'datetime'    => '2024-06-16 09:00:00',
                'maps_url'    => 'https://maps.google.com/?q=Kraton+Yogyakarta',
            ],
            [
                'title'       => 'Pantai Parangtritis',
                'description' => 'Saksikan keindahan matahari terbenam di Pantai Parangtritis yang terkenal. Nikmati naik delman atau ATV di sepanjang pantai sambil menikmati angin laut yang menyegarkan.',
                'datetime'    => '2024-06-16 16:00:00',
                'maps_url'    => 'https://maps.google.com/?q=Parangtritis+Beach,+Yogyakarta',
            ],
            [
                'title'       => 'Hutan Pinus Mangunan',
                'description' => 'Berpetualang ke Hutan Pinus Mangunan yang instagramable. Spot foto di antara pohon-pohon pinus yang menjulang tinggi dengan suasana yang sejuk dan menenangkan.',
                'datetime'    => '2024-06-17 08:00:00',
                'maps_url'    => 'https://maps.google.com/?q=Hutan+Pinus+Mangunan,+Bantul',
            ],
        ];

        foreach ($activities as $activity) {
            Activity::create($activity);
        }
    }
}
