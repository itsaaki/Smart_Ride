CREATE TABLE `rides` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `driver_id` INT(11) NOT NULL,
  `pickup_lat` DECIMAL(10, 7) NOT NULL,
  `pickup_lng` DECIMAL(10, 7) NOT NULL,
  `dropoff_lat` DECIMAL(10, 7) NOT NULL,
  `dropoff_lng` DECIMAL(10, 7) NOT NULL,
  `status` ENUM('pending', 'accepted', 'arrived', 'ongoing', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `driver_location` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `driver_id` INT(11) NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`driver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Xóa dữ liệu cũ nếu có
DELETE FROM rides;
DELETE FROM driver_location;

-- Chèn mock data vào rides
INSERT INTO rides (user_id, driver_id, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, status)
VALUES 
(1, 2, 10.7769, 106.7009, 10.762622, 106.660172, 'accepted');

-- Chèn mock data vào driver_location
INSERT INTO driver_location (driver_id, latitude, longitude, updated_at)
VALUES 
(2, 10.7700, 106.6950, NOW());
