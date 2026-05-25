<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

function request_value(string $key, string $fallback = ''): string
{
    $value = $_GET[$key] ?? $fallback;
    if (!is_string($value)) {
        return $fallback;
    }

    return trim(substr($value, 0, 120));
}

function mock_threads_rows(): array
{
    return [
        [
            'name' => 'A',
            'handle' => '@ain.hanani',
            'signal' => 'Ada sesiapa boleh recommend medical card yang bagus? Plan nak ambil untuk family...',
            'source' => 'Threads',
            'platform' => 'Public Post',
            'keyword' => 'medical card',
            'intent' => 'High',
            'detail' => 'Asking for Recommendation',
            'score' => 92,
            'location' => 'Kuala Lumpur',
            'region' => 'Malaysia',
            'time' => '2m ago',
            'assigned' => 'Farhan',
            'sourceUrl' => 'https://www.threads.net/',
        ],
        [
            'name' => 'Badrul',
            'handle' => '@badrul_88',
            'signal' => 'Takaful vs insurance, apa beza sebenarnya? Masih keliru...',
            'source' => 'Threads',
            'platform' => 'Public Post',
            'keyword' => 'takaful',
            'intent' => 'Medium',
            'detail' => 'Seeking Information',
            'score' => 65,
            'location' => 'Shah Alam',
            'region' => 'Selangor',
            'time' => '5m ago',
            'assigned' => 'Unassigned',
            'sourceUrl' => 'https://www.threads.net/',
        ],
        [
            'name' => 'Khairul',
            'handle' => '@khairul.z',
            'signal' => 'Hibah takaful untuk parents umur 60+, masih boleh ambil ke?',
            'source' => 'Threads',
            'platform' => 'Public Post',
            'keyword' => 'hibah takaful',
            'intent' => 'High',
            'detail' => 'Asking for Eligibility',
            'score' => 88,
            'location' => 'Kuala Terengganu',
            'region' => 'Terengganu',
            'time' => '9m ago',
            'assigned' => 'Hafiz',
            'sourceUrl' => 'https://www.threads.net/',
        ],
    ];
}

function estimate_intent(string $text): array
{
    $lower = strtolower($text);
    $high = ['recommend', 'advisor', 'ambil', 'plan', 'quote', 'review', 'boleh ambil', 'medical card'];
    $medium = ['apa beza', 'keliru', 'worth', 'mahal', 'takaful', 'hibah'];

    foreach ($high as $needle) {
        if (str_contains($lower, $needle)) {
            return ['High', 86, 'Asking for Recommendation'];
        }
    }

    foreach ($medium as $needle) {
        if (str_contains($lower, $needle)) {
            return ['Medium', 68, 'Seeking Information'];
        }
    }

    return ['Low', 42, 'Discussion / Awareness'];
}

function normalize_thread_row(array $row, string $keyword): array
{
    $text = (string)($row['text'] ?? $row['caption'] ?? $row['body'] ?? $row['signal'] ?? '');
    $username = (string)($row['username'] ?? $row['handle'] ?? $row['author_username'] ?? 'threads_user');
    $displayName = (string)($row['name'] ?? $row['author_name'] ?? ltrim($username, '@'));
    [$intent, $score, $detail] = estimate_intent($text);

    return [
        'name' => $displayName ?: 'Threads User',
        'handle' => str_starts_with($username, '@') ? $username : '@' . $username,
        'signal' => $text ?: 'Public Threads post matched the configured takaful keyword.',
        'source' => 'Threads',
        'platform' => 'Public Post',
        'keyword' => $keyword === 'All Keywords' ? 'takaful' : $keyword,
        'intent' => (string)($row['intent'] ?? $intent),
        'detail' => (string)($row['detail'] ?? $detail),
        'score' => (int)($row['score'] ?? $score),
        'location' => (string)($row['location'] ?? 'Malaysia'),
        'region' => (string)($row['region'] ?? 'Malaysia'),
        'time' => (string)($row['time'] ?? 'Just now'),
        'assigned' => (string)($row['assigned'] ?? 'Unassigned'),
        'sourceUrl' => (string)($row['permalink'] ?? $row['sourceUrl'] ?? $row['url'] ?? 'https://www.threads.net/'),
        'live' => true,
    ];
}

function filtered_mock_rows(string $keyword, string $intent, string $location, string $query): array
{
    return array_values(array_filter(mock_threads_rows(), function (array $row) use ($keyword, $intent, $location, $query): bool {
        $haystack = strtolower(implode(' ', [$row['name'], $row['handle'], $row['signal'], $row['keyword'], $row['location'], $row['region']]));
        return ($keyword === '' || $keyword === 'All Keywords' || $row['keyword'] === $keyword)
            && ($intent === '' || $intent === 'All' || $row['intent'] === $intent)
            && ($location === '' || $location === 'All Locations' || $row['location'] === $location || $row['region'] === $location)
            && ($query === '' || str_contains($haystack, strtolower($query)));
    }));
}

$keyword = request_value('keyword', 'All Keywords');
$intent = request_value('intent', 'All');
$location = request_value('location', 'All Locations');
$query = request_value('q', '');

$privateConfig = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.private' . DIRECTORY_SEPARATOR . 'hn-threads.php';
$config = [];
if (is_file($privateConfig)) {
    $loaded = require $privateConfig;
    if (is_array($loaded)) {
        $config = $loaded;
    }
}

$apiUrl = (string)($config['url'] ?? getenv('HN_THREADS_API_URL') ?: '');
$apiToken = (string)($config['token'] ?? getenv('HN_THREADS_API_TOKEN') ?: '');

if ($apiUrl !== '' && $apiToken !== '') {
    $requestUrl = $apiUrl . (str_contains($apiUrl, '?') ? '&' : '?') . http_build_query([
        'keyword' => $keyword === 'All Keywords' ? 'takaful' : $keyword,
        'q' => $query,
        'limit' => 25,
    ]);

    $ch = curl_init($requestUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => (int)($config['timeout'] ?? 8),
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Authorization: Bearer ' . $apiToken,
        ],
    ]);

    $raw = curl_exec($ch);
    $statusCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($raw !== false && $statusCode >= 200 && $statusCode < 300) {
        $decoded = json_decode($raw, true);
        $items = is_array($decoded['signals'] ?? null) ? $decoded['signals'] : ($decoded['data'] ?? []);
        if (is_array($items)) {
            $signals = array_map(fn($row) => normalize_thread_row(is_array($row) ? $row : [], $keyword), $items);
            echo json_encode([
                'status' => 'live',
                'message' => 'Threads live public keyword connector active.',
                'updatedAt' => date('H:i'),
                'signals' => $signals,
            ]);
            exit;
        }
    }
}

echo json_encode([
    'status' => 'mock',
    'message' => 'Threads API credentials/provider not configured yet. Showing safe fallback demo rows.',
    'updatedAt' => date('H:i'),
    'signals' => filtered_mock_rows($keyword, $intent, $location, $query),
]);
