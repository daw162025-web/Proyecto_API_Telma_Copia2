<?php
$token = 'test'; // Need an auth token... wait, I can just mock auth or use login.
$ch = curl_init('http://localhost:8000/api/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, ['email' => 'testuser123@example.com', 'password' => 'password']);
$res = json_decode(curl_exec($ch), true);
$token = $res['access_token'];

if (!$token)
    die("No token\n");

// Create 2 dummy files
file_put_contents('dummy1.jpg', 'fake image data');
file_put_contents('dummy2.jpg', 'fake image data 2');

$ch2 = curl_init('http://localhost:8000/api/petitions');
$post = [
    'title' => 'Test multiple files',
    'description' => 'Test',
    'destinatary' => 'Test',
    'category_id' => 1,
    'files[0]' => new CURLFile('dummy1.jpg', 'image/jpeg', 'dummy1.jpg'),
    'files[1]' => new CURLFile('dummy2.jpg', 'image/jpeg', 'dummy2.jpg'),
];

curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch2, CURLOPT_POST, true);
curl_setopt($ch2, CURLOPT_POSTFIELDS, $post);
curl_setopt($ch2, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token
]);

$res2 = curl_exec($ch2);
echo "Response Code: " . curl_getinfo($ch2, CURLINFO_HTTP_CODE) . "\n";
echo "Response Body: " . $res2 . "\n";
