



//Upload new Files
function uploadFiles() {
var title=document.getElementById('title').value;
var files=document.getElementById('files').files;
var miniature=document.getElementById('miniatureInput').files;

  if(files.length > 0 ){

    var formData = new FormData();
    // Read selected files
    formData.append('miniature', miniature[0])
    Array.from(files).forEach(file => {
      formData.append('files[]', file)
    })
   formData.append('title', title);

       // Ipload selected files
    var xhttp = new XMLHttpRequest();

    // Set POST method and ajax file path
    xhttp.open("POST", "uploads.php", true);
if(1==1){    // call on request changes state
    xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
        console.log(this.response);


       }}

    };

    // Send request with data
    xhttp.send(formData);

  }else{
    alert("Please select a file");
  }

  
}


    function createPreview(file, fileContents, mimeType,id) {
      var previewElement = '';
      
      // If the mimetype was not defined earlier, try to get it from through the file API

      mimeType = (mimeType === '') ? file.type : mimeType;
      
      switch (mimeType) {
        case 'image/png':
        case 'image/jpeg':
          case 'image/webp':
          previewElement = ('<img src="' + fileContents + '" />');
          break;
        default:
          console.log("esto no")
          break;
      }
      var displayElement = '<div class="preview">\
                                 <div class="preview_thumb">'+previewElement+'</div>\
                                 <span class="preview_name" title="' + file.name + '">' + file.name + '</span>\
                               </div>';
                      
                            
    if(id=="miniatureInput"){
      document.querySelector('.upload_files2').insertAdjacentHTML('beforeend',displayElement);                         
    }else{
      document.querySelector('.upload_files').insertAdjacentHTML('beforeend',displayElement); }
    }

    
    
    function getMimeType(file) {
      return new Promise(function (resolve, reject) {
        var mimeType = '';
        var fr = new FileReader();
        fr.onprogress = function(e) {
          var header = '';
          if (e.loaded > 4) {
            var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            for (var i = 0; i < arr.length; i++) {
              header += arr[i].toString(16);
            }
            switch (header) {
              case '89504e47':
                mimeType = 'image/png';
                break;
              case "ffd8ffe0":
              case "ffd8ffe1":
              case "ffd8ffe2":
                mimeType = 'image/jpeg';
                break;
              default:
                mimeType = '';
            }
            resolve({'file': file, 'header': header, 'type': mimeType});
            fr.abort();
            fr = null;
          }
        }
        fr.readAsArrayBuffer(file);
      });
    }
    
    
    function fileInputChangeHandler(target) {
      console.log(target.id+" Primero")
  // NUMBER OF FILES    target.files.length()
      var URL = window.URL || window.webkitURL;
      var fileList = target.files;      
      if (fileList.length > 0) {
        document.querySelector('.upload_files').innerHTML = '';     
        for (var i = 0; i < fileList.length; i++) {
          var file = fileList[i];
          getMimeType(file).then(function(info) {
            var fileUrl = URL.createObjectURL(info.file);
            createPreview(info.file, fileUrl, info.type,target.id);
          });
        }
      }
      document.getElementById("upload").removeAttribute("disabled")
    }


    
    
    
    
