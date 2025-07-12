<?php
session_start();
require 'config/db.php';
$items = $conn->query("SELECT items.*, users.email FROM items JOIN users ON items.user_id = users.id WHERE status = 'pending'");
?>
<!DOCTYPE html>
<html>
<head>
  <title>Admin Panel - ReWear</title>
  <link rel="stylesheet" href="styles/style.css">
</head>
<body class="dark-theme">
  <div class="admin-panel">
    <h2>Admin - Pending Item Approvals</h2>
    <ul>
      <?php while($item = $items->fetch_assoc()): ?>
        <li>
          <strong><?php echo $item['title']; ?></strong> (<?php echo $item['email']; ?>)
          <form method="POST" action="config/admin-action.php" style="display:inline;">
            <input type="hidden" name="item_id" value="<?php echo $item['id']; ?>">
            <button name="action" value="approve">Approve</button>
            <button name="action" value="reject">Reject</button>
          </form>
        </li>
      <?php endwhile; ?>
    </ul>
  </div>
</body>
</html>