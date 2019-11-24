<?php

$host = "localhost"; /* Host name */
$user = "root"; /* User */
$password = ""; /* Password */
$dbname = "cambridgeBileca"; /* Database name */

$con = mysqli_connect($host, $user, $password,$dbname);
// provjeri konekciju
if (!$con) {
 die("Connection failed: " . mysqli_connect_error());
}