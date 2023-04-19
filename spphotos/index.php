<?php


  // Start a PHP block
  echo "<style>\n";
  // Define the CSS class
  echo "img {\n";
  echo "width: 100%;\n";
  echo "}\n";

  echo ".boxz {\n";
  echo "width: 200px;\n";
  echo "height: 150px;\n";
  echo "float:left;\n";
  //echo "direction:ltr;\n";
  echo "margin-right:10px;\n";
  echo "margin-bottom:10px;\n";
  echo "}\n";
  // End the CSS block
  echo "</style>\n";


$path = "."; // "/images/"
$dh = opendir($path);
$i=1;
while (($file = readdir($dh)) !== false) {
    if($file != "." && $file != ".." && $file != "index.php" && $file != "index.html"&& $file != ".htaccess" && $file != "error_log" && $file != ".DS_Store") {
        echo "<div class='boxz'>
                 <a href='$file' target=_blank'><img src='$file'></a>
              </div>";
        //echo "<a href='$path/$file'>$file</a><br /><br />";

$i++;
    }
}
closedir($dh);
?> 