<?php
session_start();
require 'config/db.php';
if (!isset($_SESSION['user_id'])) {
  header("Location: login.php");
  exit();
}
$userId = $_SESSION['user_id'];
$userQuery = $conn->query("SELECT email, points FROM users WHERE id = $userId");
$user = $userQuery->fetch_assoc();
$items = $conn->query("SELECT * FROM items WHERE user_id = $userId");
?>
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard - ReWear</title>
  <link rel="stylesheet" href="styles/style.css">
</head>
<body class="dark-theme">
  <div class="dashboard">
    <h2>Welcome, <?php echo $user['email']; ?>!</h2>
    <p>Points: <?php echo $user['points']; ?></p>
    <h3>Your Items</h3>
    <a href="add-item.php" class="btn">+ Add New Item</a>
    <ul>
      <?php while($item = $items->fetch_assoc()): ?>
        <li><?php echo $item['title']; ?> - <?php echo $item['status']; ?></li>
      <?php endwhile; ?>
    </ul>
    <a href="logout.php">Logout</a>
  </div>
</body>
</html>