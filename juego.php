
<?php
// cardNumberSync("popoter");
// changeSeed();

if (isset($_GET["method"])) {
    $method = $_GET["method"];
    if ($method == 0) {
        if (isset($_GET["lobby"])) {
        updateGame($_GET["seed"],$_GET["size"],$_GET["template"],$_GET["lobby"]);
        }else{
        createNewGame($_GET["seed"],$_GET["size"],$_GET["template"]);
      }
    }
    if ($method == 1) {
        checkRoom($_GET["roomNumber"]);
    }

    if ($method == 3) {
        cardNumberSync($_GET["roomNumber"]);
    }
    if ($method == 4) {
         getTemplatesTitles();
    }
    if ($method == 5) {
        getImagesByTemplates($_GET["template"],$_GET["rand"],$_GET["roomNumber"]);
    }
    if ($method == 6) {
        getTemplatesTitleAndImage();
    }
}
//JoinRoom
function createNewGame($seed,$cards,$plantilla){	

        try {
            $lobbyId=getFirstLobby();
            $bd = getBD();
            $sql = "INSERT INTO partida (id, seed, cards,plantilla) VALUES (?,?,?,?)";
            $bd->prepare($sql)->execute([$lobbyId, $seed, $cards,$plantilla]);
            echo json_encode( $lobbyId);
        }
        catch(PDOException $exc) {
            echo "errror";
            echo $exc->getTraceAsString();
        }
}

function updateGame($seed,$numberOfCards,$plantilla,$lobby) {

    try {
        $bd = getBD();
        $sql = $bd->prepare("UPDATE `partida` SET  `seed`='$seed' , `cards`='$numberOfCards' , `plantilla`='$plantilla'  WHERE `id`='$lobby'");
        $sql->execute();
    }
    catch(PDOException $exc) {
        echo "errror";
        echo $exc->getTraceAsString();
    }
}

//Get First Room Id that doesn't exists
function getFirstLobby(){	

        
    try {
        $bd = getBD();
        $sql = $bd->prepare("SELECT partida.id+1 AS lobby FROM partida LEFT JOIN partida AS next ON partida.id+1 = next.id
        WHERE next.id IS NULL 
        ORDER BY partida.id LIMIT 1");
        $sql->execute();
        $row = $sql->fetch();
        $lobby=$row["lobby"];

        if(is_null($lobby)){
            echo "    111111111111";
            return 1;
        }
  
                 return $lobby;
    }
    catch(PDOException $exc) {

    }
}

//Get Templates
function getTemplatesTitles(){	
	$arr=[];
    $scan = scandir('imagenes');
	foreach($scan as $file) {
        if (!is_dir("/imagenes/$file")&&strlen($file)>4) {
         array_push($arr, $file);
     }
}	
      echo json_encode( $arr);
}
//Get First Image of Each Template
function getTemplatesTitleAndImage(){	
	$arr=[];
    $scan = scandir('imagenes');
	foreach($scan as $file) {
        if (!is_dir("/imagenes/$file")&&strlen($file)>4) {
        // array_push($arr, $file);
         $scan2 = scandir('imagenes/'.$file);
         foreach($scan2 as $image) {
            if(strlen($image)>4){
                array_push($arr, array($file,"imagenes/$file/$image"));
         //print_r($image);
         break;
        
        }
         }
     }
}	
      echo json_encode( $arr);
}

//Get Images of the Template
function getImagesByTemplates($title,$rand,$roomNumber){
	$arr=[];
    $scan = scandir('imagenes/'.$title);
	foreach($scan as $file) {
         if (strlen($file)>4) {
            array_push($arr,"imagenes/$title/$file");
          }
}	
if($roomNumber=="null"){
    $seed =rand();
}else{
    $seed = getSeed($roomNumber);
}
//Shuffle images with a seed
    srand($seed);
    shuffle($arr);
      echo json_encode( array($seed ,$arr));
}
//Get seed for randomize images
function getSeed($roomNumber) {
    try {
        $bd = getBD();
        $sql = $bd->prepare("SELECT seed FROM `partida` WHERE id =$roomNumber");
        $sql->execute();
        $results = $sql->fetchAll();
        if (count($results)) {
            $seed = $results[0][0];
        return $seed;
        }
    }
    catch(PDOException $exc) {
        echo "errror";
        echo $exc->getTraceAsString();
    }
}


//GET NUMBER OF CARDS SNC

function cardNumberSync($roomNumber) {
    try {
        $bd = getBD();
        $sql = $bd->prepare("SELECT cards,plantilla,seed FROM `partida` WHERE id =$roomNumber");
        $sql->execute();
        $results = $sql->fetchAll();
        if (count($results)) {
            $cardsNumber = $results[0][0];
            $template = $results[0][1];
            $array=array($cardsNumber,$template);
            echo json_encode($array);
        }else{
            echo json_encode(false);
        }
    }
    catch(PDOException $exc) {
        echo json_encode(false);
    }
}


//Check if room exists
function checkRoom($roomNumber) {
    try {
        $bd = getBD();
        $sql = $bd->prepare("SELECT * FROM `partida` WHERE id =$roomNumber");
        $sql->execute();
        $results = $sql->fetchAll();
        if (count($results)) {
            echo json_encode(true);
        }else{
            echo json_encode(false);
        }
    }
    catch(PDOException $exc) {
        echo json_encode("ERRROR");
    }
}


//Get Database
function getBD() {

    $cadena_conexion = 'mysql:dbname=quienesquien;host=mysql-5706.dinaserver.com;charset=utf8';        
    $usuario = 'adminQuien';
    $clave = "12345Qwert.";
    $bd = new PDO($cadena_conexion, $usuario, $clave, array(PDO::ATTR_PERSISTENT => true));
    return $bd;
}


/*


Mysql RecurringTimeEvent Script 

CREATE EVENT IF NOT EXISTS reurring_event
ON SCHEDULE EVERY 1 MINUTE
STARTS CURRENT_TIMESTAMP
ENDS CURRENT_TIMESTAMP + INTERVAL 1 HOUR
DO
INSERT INTO Demo (message,created_on) 
VALUES  ('RecurringTimeEvent',NOW());

*/
?>
