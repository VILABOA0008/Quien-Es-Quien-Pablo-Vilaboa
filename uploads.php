
<?php

$scan = scandir('imagenes');

foreach($scan as $file) {
  //Folder Exists
   if (!is_dir("/imagenes/$file")) {
  //    echo $file.'<br>';
   }
}
if(isset($_POST['title'])){
  if( strlen($_POST['title'])>4){

    $title=$_POST['title'];
    mkdir('imagenes/'.$title, 0777, true);
    //Save miniature
    if(isset($_FILES['miniature'])){
      $filename = $_FILES['miniature']['name'];
      $arr=explode(".", $filename);
      echo $filename;
      echo "filename";
      echo $arr[count($arr)-1];
      echo "extension";
      move_uploaded_file($filename,'imagenes/'.$title.'/'."0.".$arr[count($arr)-1]);
    }
    
    
 
    
    // Count total files
    $countfiles = count($_FILES['files']['name']);
    // Looping all files
    for($i=0;$i<$countfiles;$i++){
     $filename = $_FILES['files']['name'][$i];
   // $filename = $ar[$i].".png";
     // Upload file
     move_uploaded_file($_FILES['files']['tmp_name'][$i],'imagenes/'.$title.'/'.$filename);
    }
  }else{
    return "Title name is too short";
  }
    }
 


   ?>




