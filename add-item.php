<?php
session_start();
require 'config/db.php';
if (!isset($_SESSION['user_id'])) {
  header("Location: login.php");
  exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $userId = $_SESSION['user_id'];
  $title = $_POST['title'];
  $description = $_POST['description'];
  $category = $_POST['category'];
  $type = $_POST['type'];
  $size = $_POST['size'];
  $condition = $_POST['condition'];
  $tags = $_POST['tags'];

  $stmt = $conn->prepare("INSERT INTO items (user_id, title, description, category, type, size, `condition`, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
  $stmt->bind_param("isssssss", $userId, $title, $description, $category, $type, $size, $condition, $tags);
  $stmt->execute();
  header("Location: dashboard.php");
}
?>
<!DOCTYPE html>
<html>
<head>
  <title>Add Item - ReWear</title>
  <link rel="stylesheet" href="styles/style.css">
</head>
<body class="dark-theme">
  <div class="form-container">
    <h2>Add New Item</h2>
    <form method="POST">
      <input name="title" placeholder="Title" required>
      <textarea name="description" placeholder="Description"></textarea>
      <input name="category" placeholder="Category">
      <input name="type" placeholder="Type">
      <input name="size" placeholder="Size">
      <input name="condition" placeholder="Condition">
      <input name="tags" placeholder="Tags">
      <button type="submit">List Item</button>
    </form>
  </div>
</body>
</html>