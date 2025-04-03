-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 03, 2025 at 04:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smartride_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('user','driver') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `user_type`, `created_at`, `updated_at`) VALUES
(1, 'duyanh', 'duyanhdo522@gmail.com', '$2y$10$yNxKrE0J0lV3hNL15l9YSuAULbBX1vpQYgnJJe1zAL0SOrXfkBTjW', 'user', '2025-04-02 09:36:24', '2025-04-02 14:56:01'),
(2, 'anhduy', 'driver@gmail..com', '87654321', 'driver', '2025-04-02 09:36:24', '2025-04-02 09:36:24'),
(3, 'testuser', 'test@example.com', '$2y$10$', 'user', '2025-04-02 11:45:05', '2025-04-02 11:45:05'),
(7, 'user', 'user@gmail.com', '$2y$10$xGv5hseEoXjlMnAxrkkQke.Mveif1t87FCEpDhhgWmILltDB5WLjm', 'user', '2025-04-02 09:36:24', '2025-04-02 18:37:07'),
(8, 'duy', '1234@gmail.com', '$2y$10$.isDh1cVJYeUSSKdwduHY.x2uTDQhikkO9d.xkikLwgw1UrmLEV5i', 'user', '2025-04-02 19:04:17', '2025-04-02 19:04:17'),
(9, 'anh', 'uehq@gmail.com', '$2y$10$xaMTqxbhSwRu7fs896XXoe6eZ0quxOiTr1ci/nwcRhVww9AFONxKy', 'driver', '2025-04-02 19:10:57', '2025-04-02 19:10:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
