/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function () {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function () {
    document.addEventListener("deviceready", this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function () {
    //StatusBar.overlaysWebView(false);
    //cordova.plugins.notification.badge.set(10);
    //module 2
    app.push = PushNotification.init({
      android: {
        senderID: "938441703155",
      },
      ios: {
        sound: true,
        vibration: true,
        badge: true,
      },
      windows: {},
    });

    app.push.on("registration", function (data) {
      //alert("registration event: " + data.registrationId);
      //document.getElementById("regId").innerHTML = data.registrationId;
      var oldRegId = localStorage.getItem("registrationId");
      if (oldRegId !== data.registrationId) {
        // Save new registration ID
        localStorage.setItem("registrationId", data.registrationId);
        // Post registrationId to your app server as the value has changed
      } else {
        // alert(localStorage.getItem('registrationId'));
      }
    });

    app.push.on("error", function (e)   
    {
      //console.log("push error = " + e.message);
      //alert("push error = " + e.message);
    });

    app.push.on("notification", function (data) {
    //   //console.log('notification');
    //   //console.log(JSON.stringify(data));
    //   //alert(JSON.stringify(data));
    //   var res = data.message.split("ObjectID:");
    //   var res1 = res[1].trim();
    //   //alert(res1);
    //   //var res2=res1.match(/(.{1,15})/g);
    //   //alert(res2); //for numeric object id only.
    //   var objID = res1; //res2[0];
      //alert(objID);
      // localStorage.id_device = objID;
      window.location = "chat.html";
    });
  },
};
app.initialize();