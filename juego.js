var cardSelected = false;
var numberOfImages = 30;
var DEFAULT_NUMBER_OF_IMAGES = 30;
var tachado = "http://localhost//QuienEsQuien/img/tachado.png";
var dinamic;
const url = "juego.php";
const NEW_SET = 0;
const GET_NUMBER_OF_CARDS = 3;
const GET_TEMPLATES_TITLES = 4
const GET_TITLE_IMAGES = 5
const IA_PARAM = "fotos"
const POTTER_PARAM = "popoter"
var jugando=false;
var images;
var template;
var seed = null;
var sizeImagesInput;
var numberOfImagesInput;
var createButton;
var randomButton;
var endButton;
var lobby;

window.onload = function () {
    //Add elements to variables
    sizeImagesInput=getElement("sizeImagesInput");
    numberOfImagesInput=getElement("number_of_images_input");
    createButton=getElement("newSetButton");
    endButton=getElement("endButton");
    randomButton=getElement("randomButton");
    listeners();


    sizeImg = sizeImagesInput.value
    getElement("checkCrosses").addEventListener("change", change);

    //Create Cards for images
    let c=0;
    while (c < numberOfImages) {
        c++;
        createCards()
    }


     lobby = new URLSearchParams(window.location.search).get('lobby')
     //Join Lobby
    if (lobby) {
        jugando=true;
        numberOfImagesInput.setAttribute("disabled",true)
        createButton.textContent="Syncronizar"
        createButton.addEventListener("click",syncro)
        randomButton.style.display="none";
        numberOfImagesInput.style.display="none";
        syncro()
   //Create Lobby
    } else {
        createButton.addEventListener("click",createUpdateGame)
        showTemplatesGetPhotos();
    }
}

    //Add events to Elements 
function listeners() {
    sizeImagesInput.addEventListener("change",imagesizeChange)
    numberOfImagesInput.addEventListener("change",sizeChange)
    endButton.addEventListener("click",function(){
        getElement("myPhoto").setAttribute("src","http://localhost//QuienEsQuien/img/question.png")
        cardSelected = false;
        jugando=false;
        var overlays=document.querySelectorAll(".card-img-overlay")
		overlays.forEach(overlay => overlay.remove());
        endButton.style.display="none";
        randomButton.removeAttribute("disabled")
        numberOfImagesInput.style.display="inline-block";
        createButton.style.display="inline-block";
        randomButton.style.display="inline-block";
    })
}


    //Syncronize Game
function syncro() {
    roomNumber = lobby
    if (roomNumber > 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var gameData = JSON.parse(this.response);
                if (gameData) {
                    getElement("errorLabel").innerHTML = "";
                    numberOfImages = gameData[0];
                    template = gameData[1];
                    numberOfImagesInput.value = numberOfImages;
                    getPhotos(false, roomNumber);
                } else {
                    getElement("errorLabel").innerHTML = "This game don't exists";
                    console.log("This game don't exists")
                }
            }
        };
        var params = "method=" + GET_NUMBER_OF_CARDS + "&roomNumber=" + roomNumber;
        xhttp.open("GET", url + "?" + params, true);
        xhttp.send();
    }
}


//add image files to the select
function showTemplatesGetPhotos() {
    // Template choosed
    let templateTemp = new URLSearchParams(window.location.search).get('template')
    if (templateTemp) {
        template = templateTemp;
    }
    getPhotos(false, null);
}


function getPhotos(rand, roomNumber) {
    console.log(roomNumber + "  ROOM")
    console.log(template + "  template")
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //  console.log(this.response)
            let response = JSON.parse(this.response);
            seed = response[0]
            images = response[1]
            sizeMax(images.length)
            sizeChange();
            fillImgs();

        }
    };
    console.log("rand  " + rand)
    var params = "method=" + GET_TITLE_IMAGES + "&template=" + template + "&rand=" + rand + "&roomNumber=" + roomNumber;
    xhttp.open("GET", url + "?" + params, true);
    xhttp.send();
    //var img=document.querySelectorAll("card-img");
}


//CROSS IMAGES
function change() {
    var label = getElement("checkCrossesLabel");
    if (getElement("checkCrosses").checked) {
        label.textContent = "Tachar Dinamico"
        dinamic = true
    } else {
        label.textContent = "Tachar Estatico"
        dinamic = false;
    }
}

//CARD CLICKED
window.onclick = e => {
    if(jugando){
    if (e.target.tagName == "IMG" && e.target.src) {
        //SELECT YOUR CARD

        if (!cardSelected) {
            if (confirm("Seguro que quieres esa foto?")) {
                let myPhoto = document.getElementById("myPhoto");
                myPhoto.style.height = sizeImg + "px";
                myPhoto.style.width = sizeImg + "px";
                myPhoto.src = e.target.src;
                var cardTittle = getElement("myPhotoTitle")
                cardTittle.style.width = sizeImg + "px";
                cardTittle.innerHTML = e.target.parentElement.lastElementChild.textContent;
                cardSelected = true
            }

        } else {
            if (e.target.id != "myPhoto") {
                //CROSS CARD
                var array = document.getElementById("photosToPlay")
                var imgs = document.querySelectorAll("#photosToPlay .card");
                if (e.target.className == "card-img") {
                    imgOverlay = document.createElement("img");
                    imgOverlay.className = "card-img-overlay";
                    imgOverlay.style.height = sizeImg + "px";
                    imgOverlay.style.width = sizeImg + "px";
                    imgOverlay.src = tachado;
                    if (dinamic) {
                        array.insertBefore(e.target.parentElement, imgs[0])
                    }
                    e.target.parentElement.appendChild(imgOverlay)
                } else {
                    //NO CROSS CARD
                    for (let i = 0; i < imgs.length; i++) {
                        // array.insertBefore(e.target.parentElement, imgs[0])
                        if (imgs[i].childElementCount == 1) {
                            if (dinamic) {
                                array.insertBefore(e.target.parentElement, imgs[i])
                            }
                            break;
                        }
                    }
                    e.target.parentElement.removeChild(e.target)
                }
            }
        }
    }
}
}
//Change number of Images
function sizeChange() {
    var imgs = document.querySelectorAll("#photosToPlay .card");
    numberOfImages = Number(numberOfImagesInput.value)
    var maxImgs = Number(numberOfImagesInput.max);

    if (maxImgs < numberOfImages) {
        numberOfImages = maxImgs;
        numberOfImagesInput.value = maxImgs;
    } else if (numberOfImages < 2) {
        numberOfImages = 2;
        numberOfImagesInput.value = numberOfImages;
    }

    if (numberOfImages < imgs.length) {
        for (let i = numberOfImages; i < imgs.length; i++) {
            imgs[i].remove()
        }
    } else {
        for (let i = imgs.length; i < numberOfImages; i++) {
            createCards();
            fillImgs();
        }
    }
}
//Change size of images
function imagesizeChange() {
    var imgsOverlay = document.querySelectorAll("#photosToPlay .card-img-overlay");
    var imgs = document.querySelectorAll("#photosToPlay .card-img");
    var cardTitles = document.querySelectorAll(".card-title");
    sizeImg = sizeImagesInput.value
    console.log(sizeImg)
    for (let i = 0; i < imgs.length; i++) {
        if(imgsOverlay[i]){
            imgsOverlay[i].style.height = sizeImg + "px";
            imgsOverlay[i].style.width = sizeImg + "px";
        }
        imgs[i].style.height = sizeImg + "px";
        imgs[i].style.width = sizeImg + "px";
        cardTitles[i].style.width = sizeImg + "px";
    }
}

//Fill cards with Images
function fillImgs() {
    cardSelected = false;
    getElement("myPhotoTitle").innerHTML = "";
    var imgs = document.querySelectorAll("#photosToPlay .card ");
    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i].childElementCount == 2) {
            imgs[i].lastElementChild.remove()

        } else if (imgs[i].childElementCount == 3) {
            imgs[i].lastElementChild.remove()
            imgs[i].lastElementChild.remove()

        }
        var cardTittle = document.createElement("p");
        cardTittle.className = "card-title text-center"
        cardTittle.style.width = sizeImg + "px";
        //Get and Set Title of the Image From    last part of URL
        let titleImage = images[i].split("/");
        cardTittle.innerHTML = titleImage[titleImage.length - 1].split(".")[0]
        imgs[i].appendChild(cardTittle)
        //Set Image URL
        imgs[i].firstElementChild.src = images[i];
    }
}

function createCards() {
    var div = document.createElement("div");
    var img = document.createElement("img");
    div.className = "card  text-white"
    img.className = "card-img"

    img.style.height = sizeImg + "px";
    img.style.width = sizeImg + "px";
    div.appendChild(img)
    getElement("photosToPlay").append(div)

}
//Create or update game and insert game Data 
function createUpdateGame() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(!lobby){
                console.log("lobby  "+this,this.response)
            lobby = JSON.parse(this.response);
            getElement("gameLabel").innerHTML = "Sala: "+lobby;
        }
        jugando=true
        endButton.style.display="inline-block";
        randomButton.setAttribute("disabled",true)
        createButton.style.display="none";
        randomButton.style.display="none";
        numberOfImagesInput.style.display="none";
        }
    };
    var params = "method=" + NEW_SET + "&template=" + template + "&size=" + numberOfImages + "&seed=" + seed;
    if(lobby){
    var params = "method=" + NEW_SET + "&template=" + template + "&size=" + numberOfImages + "&seed=" + seed+ "&lobby=" + lobby;}
    xhttp.open("GET", url + "?" + params, true);
    xhttp.send();
}


//Check if number of cards is higher than the number of photos
function sizeMax(maxSize) { 
    if (numberOfImagesInput.value > maxSize) {
        numberOfImagesInput.value = maxSize;
        console.log("cosa")
        var imgs = document.querySelectorAll("#photosToPlay .card");
        for (let i = maxSize; i < numberOfImages; i++) {
            imgs[i].remove()
        }
    }
    numberOfImagesInput.max = maxSize;
}

function getElement(id) {
    return document.getElementById(id);
}


function removeChilds(id) {
    var div = getElement(id);
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
