function signup() {
    document.getElementById("home_login").style.display = "none";
    document.getElementById("home_signup").style.display = "block";
}
function profile() {
    document.getElementById("news_feed").style.display = "none";
    document.getElementById("courses").style.display = "none";
    document.getElementById("wall").style.display = "inline-block";
}
function courses() {
    document.getElementById("news_feed").style.display = "none";
    document.getElementById("wall").style.display = "none";
    document.getElementById("courses").style.display = "inline-block";
}
function home() {
    document.getElementById("news_feed").style.display = "inline-block";
    document.getElementById("wall").style.display = "none";
    document.getElementById("courses").style.display = "none";
}

function previewFile(){
       var preview = document.querySelector('dp'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
}

function signout(){
  document.location.href = "home.html";
}
