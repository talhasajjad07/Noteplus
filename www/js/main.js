// JavaScript Document
var API_url="http://localhost:3000/api/";
var loader =
  '<p align="center"><img src="img/loader.gif" style="width:25px" /></p>';
var app_mode = "live";
var data_arr = [];
// localStorage.clear();
function online() {
  return true;
  var networkState = navigator.connection.type;
  var states = {};
  states[Connection.UNKNOWN] = "None";
  states[Connection.ETHERNET] = "Ethernet";
  states[Connection.WIFI] = "WiFi";
  states[Connection.CELL_2G] = "2G";
  states[Connection.CELL_3G] = "3G";
  states[Connection.CELL_4G] = "4G";
  states[Connection.NONE] = "None";

  //alert('Connection type: ' + states[networkState]);
  if (states[networkState] == "None") {
    //alert('Please connect with internet.');
    navigator.notification.alert(
      "Please connect with internet.",
      alertDismissed,
      "Internet Connection",
      "OK"
    );
    return false;
  } else {
    return true;
  }
}
function alertDismissed() {
  // do something
}

//string filtering functions
function addslashes(str) {
  str = str.replace(/\'/g, "&acute;");
  str = str.replace(/\"/g, "&quot;");
  return str;
}

function show_alert(title, msg, button) {
  navigator.notification.alert(msg, alertDismissed, title, button);
}

function load_left_bar() {
  var navigation =
    "" +
    // +'<li>'
    // 	+'<a href="javascript:void();"><img src="img/Depot Cloud logo@2x.png" width=200></a>'
    // +'</li>'
    "<li>" +
    '<a href="welcome.html"><i class="fa fa-home"></i>Home</a>' +
    "</li>" +
    "<li>" +
    '	<a href=""><i class="fa fa-info-circle"></i>About</a>' +
    "</li>" +
    "<li>" +
    '	<a href=""><i class="fa fa-question-circle"></i>Help</a>' +
    "</li>";
  $("#slide-out-left").html(navigation);
}
function check_user() {
  if (localStorage.user > 0) {
     window.location='welcome.html';
    // window.location = "login.html";
  }
}
function checkWelcome(){
  if (localStorage.welcome > 0) {
      // window.location='welcome.html';
      window.location = "login.html";
  }
}
function welcome_page() {
  localStorage.welcome=1;
  window.location = "login.html";
}
function check_login() {
  $("#username").val(localStorage.user);
  $("#password").val(localStorage.pass);
  if (localStorage.remember == "True") {
    $("#remember").prop("checked", true);
  }
  if (localStorage.user_id) {
    if (localStorage.user_id != "") {
      window.location = "welcome.html";
    }
  }
}
const login = () => {
  var user = $("#email").val();
  var pass = $("#password").val();
  var datastring = "email=" + user + "&password=" + pass;
  console.log(datastring);
  if (user == "") {
    $("#err").html("*Username required.");
    return false;
  }
  if (pass == "") {
    $("#err").html("*Password required.");
    return false;
  } else {
    if (online()) {
      $("#err").html('<img src="img/loader.gif" width="50px">');
      $.ajax({
        url: API_url + "users/login-user",
        type: "post",
        data: datastring,
        success: function (data) {
          //alert(data);
          var rs = data;
          console.log(rs);
          if (rs.success == true) {
            localStorage.password = pass;
            localStorage.token = rs.token;
            window.location = "welcome.html";
          } else {
            $("#err").html("*Invalid User/Password.");
            return false;
          }
        },
      });
    }
  }
}
const register = () => {
  var email = $("#email").val();
  var username = $("#username").val();
  var pass = $("#password").val();
  var cnpass = $("#confirmpassword").val();
  var datastring = "name=" + username + "&email=" + email + "&password=" + pass;
  console.log(datastring);
  if (username == "") {
    $("#err").html("*Username required.");
    return false;
  }
  if (email == "") {
    $("#err").html("*Email required.");
    return false;
  }
  if (pass == "") {
    $("#err").html("*Password required.");
    return false;
  }
  if (pass != cnpass) {
    $("#err").html("*Password not matched.");
    return false;
  }
  if (!validateEmail(email)) {
    $("#err").html('Please enter a valid email address');
    return false;
  }
   else {
    if (online()) {
      $("#err").html('<img src="img/loader.gif" width="50px">');
      $.ajax({
        url: API_url + "users/register-user",
        type: "post",
        data: datastring,
        success: function (data) {
          //alert(data);
          var rs = data;
          console.log(rs);
          if (rs.success == true) {
            localStorage.password = pass;
            localStorage.token = rs.token;
            window.location = "welcome.html";
          } else {
            $("#err").html(rs.message);
            return false;
          }
        },
      });
    }
  }
}
const validateEmail = (email) => {
  // Regular expression pattern for basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};
function load_my_account() {
  if (online()) {
    $("#err").html("");
    var user_id = localStorage.user_id;
    var datastring = "&user_id=" + user_id;
    $("#err").html("");
    $.ajax({
      url: API_url + "load_account.php",
      type: "post",
      data: datastring,
      success: function (data) {
        var store = JSON.parse(data);
        //alert(data);
        if (store[0]["response"] == 1) {
          localStorage.user_id = store[0]["user_id"];
          localStorage.name = store[0]["name"];
          localStorage.username = store[0]["username"];
          localStorage.email = store[0]["email"];
          localStorage.phone_number = store[0]["phone_number"];
        }
      },
    });
    $("#name").val(localStorage.name);
    $("#username").val(localStorage.username);
    $("#email").val(localStorage.email);
    $("#phone_number").val(localStorage.phone_number);
  }
}
function DisplayCurrentTime() {
  var date = new Date();
  var new_date = moment();
  localStorage.current_date = new_date.format("D/MM/YYYY");
  var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  var am_pm = date.getHours() >= 12 ? "PM" : "AM";
  hours = hours < 10 ? "0" + hours : hours;
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  time = hours + ":" + minutes + ":" + am_pm;
  localStorage.new_time = time;
}
const loadNotes = () => {
  console.log("token is:",localStorage.token);
  if (online()) {
    if (localStorage.data == null) {
      var rs = 0;
    } else {
      var rs = JSON.parse(localStorage.data);
    }
    var output = "<div>";
    if (rs.length > 0) {
      for (var i = 0; i < rs.length; i++) {
        output =
          output +
          '    <div class="load_list" id=' +
          rs[i].id +
          ">" +
          '      <p class="title">' +
          rs[i].title +
          "</p>" +
          "      <span>" +
          rs[i].Date +
          "</span> <span>" +
          rs[i].time +
          "</span>" +
          "    </div>";
      }
      output =
        output +
        "</div>" +
        '    <div class="add-btn1">' +
        '      <p class="add_btn1" onclick="createNote();">+</p>' +
        "    </div>";
      $("#load_data").html(output);
    } else {
      output =
        output 
        +'    <div class="main_div1">' 
        +'      <span>Welcome to Notesplus</span>'
        +'      <p>Press + button to add</p>' 
        +'    <div class="createNoteBtn">'
        +'      <button class="add_btn" onclick="createNote();">+</button>' 
        +'    </div>';
        +'    </div>'
      output = output + "</div>";
      $("#load_data").html(output);
    }
  }
}
const createNote = () => {
  window.location = "createNote.html";
}
const saveData = () => {
  var title = $("#title").val();
  var desc = $("#description").val();
  var token = localStorage.token;
  console.log(title);
  console.log(desc);
  var datastring = "name=" + username + "&email=" + email + "&password=" + pass;
  console.log(datastring);
  if (username == "") {
    $("#err").html("*Username required.");
    return false;
  }
  if (email == "") {
    $("#err").html("*Email required.");
    return false;
  }
  if (pass == "") {
    $("#err").html("*Password required.");
    return false;
  }
  if (pass != cnpass) {
    $("#err").html("*Password not matched.");
    return false;
  }
  if (!validateEmail(email)) {
    $("#err").html('Please enter a valid email address');
    return false;
  }
  else {
    if (online()) {
      $.ajax({
        url: API_url + "users/AddNote",
        type: "post",
        data: datastring,
        success: function (data) {
          //alert(data);
          var rs = data;
          console.log(rs);
          if (rs.success == true) {
            localStorage.password = pass;
            localStorage.token = rs.token;
            window.location = "welcome.html";
          } else {
            $("#err").html(rs.message);
            return false;
          }
        },
      });
    }
  }
  // window.location = "welcome.html";
}
function start_loading() {
  $(".main-loader").css("display", "flex");
}
function stop_loading() {
  $(".main-loader").css("display", "none");
}