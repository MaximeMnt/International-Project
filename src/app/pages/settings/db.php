<?php
    $servername='localhost';
    $username='vmd';
    $password='OuluAntwerp';
    $dbname = "vmdDB1";
    $conn=mysqli_connect($servername,$username,$password,"$dbname");
      if(!$conn){
          die('Could not Connect MySql Server:' .mysql_error());
        }
        echo 'Connected successfully';
?>