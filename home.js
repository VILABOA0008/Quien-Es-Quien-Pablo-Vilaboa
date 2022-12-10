
const GET_TEMPLATES_TITLES = 6;
const CHECK_ROOM = 1;
const url = "juego.php";

//Show Templates
window.onload = function () {
  var joinInput=document.getElementById("join_input")
  joinInput.addEventListener("keyup", function(){
      if(joinInput.value.length>0){
          getElement("syncButton").removeAttribute("disabled")
      }else{
          getElement("syncButton").setAttribute("disabled",true)
      }
  })
  getElement("syncButton").addEventListener("click", sync);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.response);
      var titles = JSON.parse(this.response)
      console.log(titles);


      var container = document.getElementById("templates");
      for (var i = 0; i <= titles.length - 1; i++) {
        var div = document.createElement("a");
        div.className = "card  text-white"
        
        var img = document.createElement("img");
        img.className = "card-img"
        img.src = titles[i][1]
        div.href = "http://localhost//QuienEsQuien/codigo/test/quienesquien.html?template="+titles[i][0];
        img.style.height = "150px";
        img.style.width = "150px";

        var text = document.createElement("p");
        text.innerHTML=titles[i][0]


        div.appendChild(img)
        div.appendChild(text)
        container.appendChild(div)
      }

    }
  };
  var params = "method=" + GET_TEMPLATES_TITLES;
  xhttp.open("GET", url + "?" + params, true);
  xhttp.send();

}
//Syncronize Game
function sync(){
var roomNumber=getElement("join_input").value;
console.log("roomNumber  "+roomNumber)
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    //Check if Game Exists
    if (this.readyState == 4 && this.status == 200) {
      console.log("check  "+this.response)
      var check = JSON.parse(this.response)
      if(check){
 window.open("http://localhost//QuienEsQuien/codigo/test/quienesquien.html?lobby="+roomNumber,"_self")
}else{
  getElement("join_input").style.color="red";
}

}
  }; 
   var params = "method=" + CHECK_ROOM+ "&roomNumber=" + roomNumber;
  xhttp.open("GET", url + "?" + params, true);
  xhttp.send();
  }


function getElement(id) {
  return document.getElementById(id);
}
