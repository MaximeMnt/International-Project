<?php
include_once 'db.php';
if(isset($_POST['submit']))
{    
 
     $sql = "INSERT INTO Data (Temperature,Humidity,Moisture)
     VALUES (' ',' ',' ')";
 
     if (mysqli_query($conn, $sql)) {
        echo "New record has been added successfully !";
     } else {
        echo "Error: " . $sql . ":-" . mysqli_error($conn);
     }
     mysqli_close($conn);
}

if(isset($_POST['submit']))
{    
 
     $sql = "INSERT INTO Data (Name,Password)
     VALUES ('admin','admin')";
 
     if (mysqli_query($conn, $sql)) {
        echo "New record has been added successfully !";
     } else {
        echo "Error: " . $sql . ":-" . mysqli_error($conn);
     }
     mysqli_close($conn);

?>