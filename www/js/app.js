var changeStatusBarColor, readThisBook, readThisBook2, readTextToSpeech, stopTextToSpeech, readThisAudio, readThisVideo, fireUpPayments, readThisHealth, getImg4rmGallery;
var shareODM, exitApp;

// Dom7
var $$ = Dom7;
Framework7.use(Framework73dPanels);

// Init App
var app = new Framework7({
  name : 'ODM Mobile',
  id: 'org.ourdailymanna.ODMMobile',
  root: '#app',
  theme: 'auto',
  language: 'en',
  version : "1.5.0",
  routes: routes,
   panels3d: {
    enabled: true,
  }
});

var mainView = app.views.create('.view-main', {
  url : './main.html',
  name : 'main',
  iosSwipeBack : false,
  router : true
});


document.addEventListener("deviceready", deviceIsReady, false);



function deviceIsReady(){

exitApp = function(){
  navigator.app.exitApp();
}


window.plugins.PushbotsPlugin.initialize("5ca853c50540a3283b0c6944", {"android":{"sender_id":"142823326897"}});
// Only with First time registration
window.plugins.PushbotsPlugin.on("registered", function(token){
  console.log("Registration Id:" + token);
});

//Get user registrationId/token and userId on PushBots, with evey launch of the app even launching with notification
window.plugins.PushbotsPlugin.on("user:ids", function(data){
  console.log("user:ids" + JSON.stringify(data));
});

shareODM = function(){

// this is the complete list of currently supported params you can pass to the plugin (all optional)
var options = {

  message: 'Get Our Daily Manna Mobile (Android & iOS) and get experience the word of God from ODM!', // not supported on some apps (Facebook, Instagram)
  subject: 'ODM Mobile', // fi. for email
  files: ['', ''], // an array of filenames either locally or remotely
  url: 'https://ourdailymanna.org',
  chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title,
  appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
};

var onSuccess = function(result) {
  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
  console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
};

var onError = function(msg) {
  console.log("Sharing failed with message: " + msg);
};

window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);

}


readTextToSpeech = function(theText){

  var selectedLang = window.localStorage.getItem("language_select");
  
    if(selectedLang == "en"){
    app.dialog.preloader("Initiating Text To Speech...");

    setTimeout(function(){
      app.dialog.close();
    }, 1500);

        TTS.speak({
          text : theText,
          locale: 'en-US',
          rate: 1
        }, 
        function () {

            console.log('success');

        }, function (reason) {
            
            app.dialog.alert("Text to Speech Failed!");

        });
     
  }
  else{

        app.dialog.alert("TTS is not available for non-english users");

  }
}


  stopTextToSpeech = function(){
        TTS.speak({
          text : '',
          locale: 'en-US',
          rate: 1
        });
  }




  fireUpPayments = function(thePaymentUrl){

    var ref = cordova.InAppBrowser.open(thePaymentUrl, '_blank', 'location=yes');
    ref.addEventListener('exit', exitInappBrowser);

  }


  function exitInappBrowser(){
    
      mainView.router.navigate("/mypurchases/");
  }


  getImg4rmGallery = function(){

       destinationTyper = Camera.DestinationType.FILE_URI;
        pictureSource = Camera.PictureSourceType.PHOTOLIBRARY;
          
          navigator.camera.getPicture(cameraGood, cameraBad, 
          {
              quality : 70, 
              destinationType : destinationTyper,
              sourceType : pictureSource
           });
  }




  function cameraGood(imageURI){

      app.dialog.preloader("Uploading Image...");
        
          console.log(imageURI);
            $$(".dp-container").css({"background-image": imageURI});

            setTimeout(function(){
                uploadImage(imageURI);
              }, 500);

    }


  function cameraBad(message) {
      app.dialog.close();
      app.dialog.alert('Picture Change Failed ' + message);
  }




  function uploadImage(theImage){

      var theUser = window.localStorage.getItem("permanentReg");
      theUser = JSON.parse(theUser);
      var user_id = theUser.user_serial;

      
          var win = function (r) {

            app.dialog.close();

            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);



            app.request.post("https://ourdailymanna.org/xandercage/brexit/odmorg/finish_user_image_upload.php",
            {

              "the_uploaded_image" : r.response,
              "the_user" : user_id
            },
            function(data){

              app.dialog.close();

              if(data == "Successful Upload"){
                
                window.localStorage.setItem("userLogo", r.response + user_serial);
                mainView.router.navigate("/settings/");
              }
              else{
                app.dialog.alert(data);
                
              }
            }
            ,
            function(){
              app.dialog.close();
              app.dialog.alert("Network Error. Try again later");
            });


        }

        var fail = function (error) {

            app.dialog.close();
            app.dialog.alert("Upload Error. Try again later");
            
        }

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = theImage.substr(theImage.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.chunkedMode = false;

        var params = {};
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;

        var ft = new FileTransfer();
        ft.upload(theImage, encodeURI("https://ourdailymanna.org/xandercage/brexit/odmorg/upload_user_image.php"), win, fail, options);


    }



  document.addEventListener("backbutton", trapBackButton, false);
}





function trapBackButton(){

  var currentPage = mainView.router.currentRoute.name;
  if(currentPage == "main" || currentPage == "signup" || currentPage == "addphone" || currentPage == "enterotp" || currentPage == "dashboard"){
    navigator.app.exitApp();
  }
  else if(currentPage == "store" || currentPage == "settings" || currentPage == "signup"){
      mainView.router.navigate("/dashboard/");
  }

  else if(currentPage == "editprofile" || currentPage == "changepassword"){
      mainView.router.navigate("/settings/");
  }
  else if(currentPage == "read"){
      stopTextToSpeech();
  }
  else{
    mainView.router.back();
  }

}





readThisBook = function(bookSerialNo){

  var selectedLang = window.localStorage.getItem("language_select");
  var userCurrency = window.localStorage.getItem("country_currency");
  var userContinent = window.localStorage.getItem("country_continent");

  var pReg = window.localStorage.getItem("permanentReg");
  pReg = JSON.parse(pReg);
  var user_sn = pReg.user_serial;


  app.dialog.preloader("Previewing Book...");
   app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/read_book.php',
       {
          book_sn : bookSerialNo,
          user_sn : user_sn,
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent

        }, 
        function (data) {

           console.log(data);
           data = JSON.parse(data);
           
           
            var bookSN = data.book_sn;
             var bookName = data.book_name;
             var bookThumbnail = data.book_thumbnail;
             var bookDescription = data.book_description;
             var releaseDate = data.release_date;
             var price = data.price_naira;
             var book_buy_count = data.book_count;
             var wordsCount = data.words_count;
             var verifyPurchase = data.verify_purchase;

             var bookToPreview = {
              bookSN : bookSN,
              bookName : bookName,
              bookThumbnail : bookThumbnail,
              bookDescription : bookDescription,
              releaseDate : releaseDate,
              priceTag: price,
              bookCount: book_buy_count,
              wordsCount: wordsCount,
              verifyPurchase: verifyPurchase
             }

             bookToPreview = JSON.stringify(bookToPreview);
             window.localStorage.setItem("theBookToPreview", bookToPreview);

           setTimeout(function () {
              app.dialog.close();
              mainView.router.navigate("/preview/");
            }, 3000);
                      
      }, function(){
            console.log("Network Error!. Try again later.");
      });
}


readThisBook2 = function(bookSerialNo){


  var selectedLang = window.localStorage.getItem("language_select");
  var userCurrency = window.localStorage.getItem("country_currency");
  var userContinent = window.localStorage.getItem("country_continent");

  var userDetails = window.localStorage.getItem("permanentReg");
  userDetails = JSON.parse(userDetails);
  var user_sn = userDetails.user_serial;

  app.dialog.preloader("Opening Book...");
   app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/read_book.php',
       {
          book_sn : bookSerialNo,
          user_sn : user_sn,
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent

        }, 
        function (data) {

           console.log(data);
           data = JSON.parse(data);
           
           
            var bookSN = data.book_sn;
             var bookName = data.book_name;
             var bookThumbnail = data.book_thumbnail;
             var bookContent = data.book_content;
             var releaseDate = data.release_date;

             var bookToRead = {
              bookSN : bookSN,
              bookName : bookName,
              bookThumbnail : bookThumbnail,
              bookContent : bookContent,
              releaseDate : releaseDate
             }

             bookToRead = JSON.stringify(bookToRead);
             window.localStorage.setItem("theBookToRead", bookToRead);

           setTimeout(function () {
              app.dialog.close();
              mainView.router.navigate("/read/");
            }, 3000);
                      
      }, function(){
            console.log("Unable to find request");
      });
}




readThisAudio = function(audioSN){

      app.dialog.preloader("Loading Audio...");

      app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_this_audio.php', 
      {
        "audio_sn" : audioSN
      },
        function (data) {
           console.log(data);
           var data = JSON.parse(data);
            console.log(data);
           

            var audioSN = data.audio_sn;
            var audioName = data.audio_name;
            var audioDescription = data.audio_description;
             var audioThumbnail = data.audio_thumbnail;
             var audioUrl = data.audio_url;
             var audioLength = data.audio_length;
             var releaseDate = data.release_date;

             var calcLength = audioLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = audioLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds";
             
         
          
        var audioProperties = {
            audioSN: audioSN,
            audioName: audioName,
            audioDescription, audioDescription,
            audioThumbnail: audioThumbnail,
            audioUrl: audioUrl,
            audioLength: calcLengthDisplay,
            releaseDate: releaseDate
        }

        audioProperties = JSON.stringify(audioProperties);
        window.localStorage.setItem("audioProperties", audioProperties);
        setTimeout(function(){
          app.dialog.close();
          mainView.router.navigate("/playaudio/");  
        }, 3000);
             
        
      }, function(){
            app.dialog.close();
            app.dialog.alert("Network Error! Try Again");
      });

      
        
    }




readThisVideo = function(videoSN){

      app.dialog.preloader("Loading Video...");

      app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_this_video.php', 
      {
        "video_sn" : videoSN
      },
        function (data) {
           console.log(data);
           var data = JSON.parse(data);
            console.log(data);
           

            var videoSN = data.video_sn;
            var videoName = data.video_name;
            var videoDescription = data.video_description;
             var videoThumbnail = data.video_thumbnail;
             var videoUrl = data.video_url;
             var videoLength = data.video_length;
             var releaseDate = data.release_date;

             var calcLength = videoLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = videoLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds";
             
         
          
        var videoProperties = {
            videoSN: videoSN,
            videoName: videoName,
            videoDescription, videoDescription,
            videoThumbnail: videoThumbnail,
            videoUrl: videoUrl,
            videoLength: calcLengthDisplay,
            releaseDate: releaseDate
        }

        videoProperties = JSON.stringify(videoProperties);
        window.localStorage.setItem("videoProperties", videoProperties);
        setTimeout(function(){
          app.dialog.close();
          mainView.router.navigate("/playvideo/");  
        }, 3000);
             
        
      }, function(){
            app.dialog.close();
            app.dialog.alert("Network Error! Try Again");
      });

      
        
    }







readThisHealth = function(healthSN){

      app.dialog.preloader("Loading Health Tip...");

      app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_this_health_tip.php', 
      {
        "health_sn" : healthSN
      },
        function (data) {
           console.log(data);
           var data = JSON.parse(data);
            console.log(data);
           

            var healthSN = data.sn;
            var healthTopic = data.topic;
             var healthImage = data.image;
             var healthContent = data.content;
             var releaseDate = data.release_date;

             
            
         
          
        var healthProperties = {
            healthSN: healthSN,
            healthTopic: healthTopic,
            healthContent, healthContent,
            healthImage: healthImage,
            releaseDate: releaseDate
        }

        healthProperties = JSON.stringify(healthProperties);
        window.localStorage.setItem("healthProperties", healthProperties);

        setTimeout(function(){
          app.dialog.close();
          mainView.router.navigate("/playhealth/");  
        }, 3000);
             
        
      }, function(){
            app.dialog.close();
            app.dialog.alert("Network Error! Try Again");
      });

      
        
    }





/* Greenie defined functions */

$$(document).on('page:init', '.page[data-name="signup"]', function (e){



  if (!window.localStorage.getItem("language_select")) {

    window.localStorage.setItem("language_select","en");
  }

  var initSelectedLanguage = window.localStorage.getItem("language_select");
  var translateSelectedLang = "";

  switch(initSelectedLanguage){
    case "en" : translateSelectedLang = "English"; break;
    case "ar" : translateSelectedLang = "Arabic"; break;
    case "zh" : translateSelectedLang = "Chinese"; break;
    case "es" : translateSelectedLang = "Spanish"; break;
    case "sw" : translateSelectedLang = "Swahili"; break;
    case "fr" : translateSelectedLang = "French"; break;
    case "de" : translateSelectedLang = "German"; break;
    default : translateSelectedLang = "Russian";
  }

  $$("option[value=" + translateSelectedLang + "]").prop("selected", "selected");



  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#signup-text").text(languagesEngine[selectedLang][$$("#signup-text").text()]);
    $$("#haveacc-text").text(languagesEngine[selectedLang][$$("#haveacc-text").text()]);
    $$("#form-first-name").text(languagesEngine[selectedLang][$$("#form-first-name").text()]);
    $$("#form-last-name").text(languagesEngine[selectedLang][$$("#form-last-name").text()]);
    $$("#form-form-email").text(languagesEngine[selectedLang][$$("#form-form-email").text()]);
    $$("#form-password").text(languagesEngine[selectedLang][$$("#form-password").text()]);
    $$("#form-agreement").text(languagesEngine[selectedLang][$$("#form-agreement").text()]);
    $$("#create-acc-btn").text(languagesEngine[selectedLang][$$("#create-acc-btn").text()]);
    $$("#facebook-signup-btn").text(languagesEngine[selectedLang][$$("#facebook-signup-btn").text()]);
    $$("#support-text").text(languagesEngine[selectedLang][$$("#support-text").text()]);
}

runLang();







  



        $$("#signup-form").on("submit", function(){

              $$("#signup-btn").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "diabled");             

                var tempReg = {
                  first_name : $$("#first-name").val(),
                  last_name : $$("#last-name").val(),
                  email : $$("#email").val(),
                  password : $$("#password").val()
                }

                var tempReg = JSON.stringify(tempReg);
                window.localStorage.setItem("tempReg", tempReg);
                mainView.router.navigate("/addphone/");
          });

            var smartSelect = app.smartSelect.create({
              el : '.select-language',
              valueEl : '.open-vertical',
              navbarColorTheme : 'black',
              formColorTheme : 'black',
              closeOnSelect : true,
              navbarColorTheme : 'purple',
              formColorTheme : 'purple',
              pageTitle : 'Select Language',
              openIn : 'popup',
              popupCloseLinkText : 'Done',
              on : {
              closed : function(){
                var whatWasSelected = $$(".open-vertical").html();
                var languageSelectedISO2 = "";
                switch(whatWasSelected){
                  case "English": languageSelectedISO2 = "en"; break;
                  case "French": languageSelectedISO2 = "fr"; break;
                  case "Spanish": languageSelectedISO2 = "es"; break;
                  case "Chinese": languageSelectedISO2 = "zh"; break;
                  case "Swahili": languageSelectedISO2 = "sw"; break;
                  case "German": languageSelectedISO2 = "de"; break;
                  case "Arabic": languageSelectedISO2 = "ar"; break;
                  default: languageSelectedISO2 = "ru";
                }
                var tempCountry = window.localStorage.setItem("language_select", languageSelectedISO2);
                setTimeout(function(){
                  mainView.router.refreshPage();
                }, 300);

                
              }
            }
            });


            $$("#facebook-signup-btn").on("click", function(){

                app.dialog.alert("Signing Up with Facebook...");
                fbLogin();
            })




            function fbLogin() {
      

    facebookConnectPlugin.login(["public_profile", "email"], function(result){
    //auth success
    console.log(JSON.stringify(result));


    //calling api
    facebookConnectPlugin.api("/me?fields=email,name,picture,password", ["public_profile","email","password"], function(userData){

      
      theUserData = userData;

      showNylon();
          
          var signupEmail = theUserData.email;
          var signUpName = theUserData.name;
          var splitName = signUpName.split(" ");
          var fbPassword = theUserData.password;

          signupFirstName = splitName[0];
          signupLastName = splitName[1];

          var tempReg2 = {
                  first_name : signupFirstName,
                  last_name : signupLastName,
                  email : signupEmail,
                  password : fbPassword
                }

              
          window.localStorage.setItem("tempReg", tempReg2);
          mainView.router.navigate("/addphone/");
           
        
    }, function(error){

      hideNylon();
      toast.show(JSON.stringify(error));
    });


  },

  function(error){

    hideNylon();
    toast.show(JSON.stringify(userData));

  });


  }


         

});




$$(document).on('page:init', '.page[data-name="addphone"]', function (e){

    
  

  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#back").text(languagesEngine[selectedLang][$$("#back").text()]);
    $$("#add-phone-title").text(languagesEngine[selectedLang][$$("#add-phone-title").text()]);
    $$("#enter-phone-number").text(languagesEngine[selectedLang][$$("#enter-phone-number").text()]);
    $$("#we-text-you").text(languagesEngine[selectedLang][$$("#we-text-you").text()]);
    $$("#country-select").text(languagesEngine[selectedLang][$$("#country-select").text()]);
    $$("#phone-number-box").prop("placeholder", languagesEngine[selectedLang][$$("#phone-number-box").prop("placeholder")]);
    $$("#verify-phone-btn").text(languagesEngine[selectedLang][$$("#verify-phone-btn").text()]);
}

runLang();




  for (var i = 0; i < countries.length; i++) {
    var countryName = countries[i].name;
    var countryCode = countries[i].dial_code;
    $$("#countries").append("<option value='" + countryName + " " + countryCode + "'>" + countryName + " " + countryCode + "</option>");
  }


    window.localStorage.setItem("temp_country", "Nigeria");
    var splitWhatWasSelected = "";

       var smartSelect = app.smartSelect.create({
              el : '.select-country',
              closeOnSelect : true,
              navbarColorTheme : 'black',
              formColorTheme : 'black',
              searchbar : true,
              searchbarPlaceholder : 'Search Country',
              pageTitle : 'Select Country',
              openIn : 'popup',
              popupCloseLinkText : 'Done',
              appendSearchbarNotFound : '<div class="block searchbar-not-found">Country not found!</div>',
              on : {
              closed : function(){
                var whatWasSelected = $$(".item-after").html();
                splitWhatWasSelected = whatWasSelected.split(" ");
                var country = splitWhatWasSelected[0];
                var tempCountry = window.localStorage.setItem("temp_country", country);
              }
            }
        });



       $$("#verify-phone").on("click", function(){

        var phoneNumber = $$("#phone-number-box").val();
       var realPhoneNumber = splitWhatWasSelected[splitWhatWasSelected.length - 1] + phoneNumber;
        console.log(realPhoneNumber);

        
        if (phoneNumber.trim() === "" || phoneNumber.trim() === null) {
          app.dialog.alert("Enter a valid Phone Number");
        }
        else{

        
        $$("#verify-phone").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "disabled");
             
           //Perform ajax request to xender
           app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/generate_code.php', 
              function (data) {
                 runSMSXend(data);
                 runEmailXend(data);
                 console.log(data);
            }, function(){
                  console.log("Registration error occured. Try again later");
            });
        }


             function runSMSXend(theOTPCode){

              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/xender.php', 
                { 
                  "phone_number": realPhoneNumber,
                  "message" : "Welcome to Our Daily Manna. Your OTP is " + theOTPCode
                }, function (data) {

                   console.log(data);

                   //Store otp code and phone number in Localstorage once sms is sent
                   window.localStorage.setItem('temp_phone_number', splitWhatWasSelected[splitWhatWasSelected.length - 1] + phoneNumber);
                   window.localStorage.setItem('concurrent_otp', theOTPCode);
                   mainView.router.navigate("/enterotp/");

              }, function(){
                    console.log("Registration error occured. Try again later");
              });

            }




            function runEmailXend(theOTPCode){

              //Fetch_mail
              var tempRegister = window.localStorage.getItem("tempReg");
              tempRegister = JSON.parse(tempRegister);
              var tempMail = tempRegister.email;

              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/xender_mail.php', 
                { 
                  "user_mail": tempMail,
                  "message" : "Welcome to Our Daily Manna. Your OTP is " + theOTPCode
                }, function (data) {

                   console.log(data);

              }, function(){
                    console.log("Registration error occured. Try again later");
              });

            }


            //Quickly send OTP to mail too
            
       });

       
});







$$(document).on('page:init', '.page[data-name="enterotp"]', function (e){

 

  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#back").text(languagesEngine[selectedLang][$$("#back").text()]);
    $$("#verify-code-text").text(languagesEngine[selectedLang][$$("#verify-code-text").text()]);
    $$("#text-you-code").text(languagesEngine[selectedLang][$$("#text-you-code").text()]);
    $$("#no-otp").text(languagesEngine[selectedLang][$$("#no-otp").text()]);
    $$("#resend-otp").text(languagesEngine[selectedLang][$$("#resend-otp").text()]);
    $$("#otp-resent").text(languagesEngine[selectedLang][$$("#otp-resent").text()]);
    $$("#verify-code-btn").text(languagesEngine[selectedLang][$$("#verify-code-btn").text()]);
}

runLang();






  var concurrentOtp = window.localStorage.getItem("concurrent_otp");

  
    $$("#verify-otp").on("click", function(){

      $$("#verify-otp").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "disabled");

      //Grab box content and LoacalStorage Content
      var suppliedOtp = $$("#supply-otp-box").val();
      
      suppliedOtp = parseInt(suppliedOtp);
      concurrentOtp = parseInt(concurrentOtp);

    
            if (suppliedOtp == concurrentOtp) {

              //grab temp_reg from Localstorage
              var keptReg = window.localStorage.getItem('tempReg');
              keptReg = JSON.parse(keptReg);

              

              //Once otp is correct, call on registration hub
              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/user_registration.php', 
                { 
                  "new_user_first_name": keptReg.first_name,
                  "new_user_last_name": keptReg.last_name,
                  "new_user_mail": keptReg.email,
                  "new_user_phone": window.localStorage.getItem('temp_phone_number'),
                  "new_user_password": keptReg.password,
                  "new_user_country": window.localStorage.getItem("temp_country")

                }, function (data) {

                  data = data.split(" ");

                      if (data[0] == "Successful") {

                        //Build a permanent LocalStorage for registered users
                          var permanentReg = {
                            user_serial : data[1],
                            first_name : keptReg.first_name,
                            last_name : keptReg.last_name,
                            email : keptReg.email,
                            password : keptReg.password,
                            country : window.localStorage.getItem("temp_country"),
                            phone_number : window.localStorage.getItem('temp_phone_number')
                          }

                          permanentReg = JSON.stringify(permanentReg);
                          window.localStorage.setItem("permanentReg", permanentReg);

                          //Since reg is successful, store user continent as well
                          var userCountry = window.localStorage.getItem("temp_country");
                         

                        for (var i = 0; i < countries.length; i++) {
                          var countryName = countries[i].name;
                          
                            if(countryName == userCountry){

                              //Now look for countries continent, code, currency

                              var countryISOCode = countries[i].code;
                              window.localStorage.setItem("country_code", countryISOCode);

                              //capture currency from country code as well
                              var countryCurrency = countriesEngine[countryISOCode]['currency'];
                              window.localStorage.setItem("country_currency", countryCurrency);

                              //Capture country's continent as well
                              var countryContinent = countriesEngine[countryISOCode]['continent'];
                              var realContinent = continents[countryContinent];
                              window.localStorage.setItem("country_continent", realContinent);

                              window.localStorage.setItem("country_name", userCountry);
                              window.localStorage.removeItem("temp_country");
                              break;
                            }
                          
                        }
                       

                            setTimeout(function(){
                              mainView.router.navigate("/dashboard/");
                            }, 3000);
                      }
                      else{

                        app.dialog.alert(data);
                        $$("#verify-otp").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Verify Code").prop("disabled", false);

                      }

              }, function(){
                    console.log("Registration error occured. Try again later");
              });

              
             
                
            }
            else{
              $$("#verify-otp").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Verify Code").prop("disabled", false);
              app.dialog.alert("Inavalid OTP supplied");
            }
            
    });



      $$("#resend-otp").on("click", function(){
          $$("#resend-otp").addClass("hidden");
          $$("#otp-resent").addClass("hidden");
          $$("#loading-span").removeClass("hidden");

          app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/xender.php', 
          { 
            "phone_number": window.localStorage.getItem('temp_phone_number'),
            "message" : "Welcome to Our Daily Manna. Your OTP is " + concurrentOtp
          }, function (data) {

              $$("#resend-otp").addClass("hidden");
              $$("#otp-resent").removeClass("hidden");
              $$("#loading-span").addClass("hidden");

              setTimeout(function(){
                $$("#resend-otp").removeClass("hidden");
                $$("#otp-resent").addClass("hidden");
                $$("#loading-span").addClass("hidden");
              }, 25000);

        }, function(){
              console.log("Registration error occured. Try again later");
        });
    });


});




$$(document).on('page:init', '.page[data-name="dashboard"]', function (e){



  $$(".share-odm-btn").on("click", function(){
    shareODM();
  });

  var selectedLang = window.localStorage.getItem("language_select");
  var userCurrency = window.localStorage.getItem("country_currency");
  var userContinent = window.localStorage.getItem("country_continent");
  function runLang(){
    

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#health-tip-today").text(languagesEngine[selectedLang][$$("#health-tip-today").text()]);
    $$(".dashboard-series-text").text(languagesEngine[selectedLang][$$(".dashboard-series-text").text()]);
    $$("#menu-text").text(languagesEngine[selectedLang][$$("#menu-text").text()]);
    $$("#dashboard-update-profile-text").text(languagesEngine[selectedLang][$$("#dashboard-update-profile-text").text()]);
}

runLang();




  $$("#panel-logout").on("click", function(){

      app.dialog.preloader("Logging Out...");
      window.localStorage.removeItem("permanentReg");
        setTimeout(function(){
          app.dialog.close();
          mainView.router.navigate("/main/");
        }, 5000);

  });


  //Find permanent reg
  var permanentReg = window.localStorage.getItem("permanentReg");
  permanentReg = JSON.parse(permanentReg);
  var pullFirstName = permanentReg.first_name;
  var pullLastName = permanentReg.last_name;
  var pullMyMail = permanentReg.email;

  $$("#display-first-name").text(pullFirstName);
  $$("#display-my-first-name").text(pullFirstName);
  $$("#display-my-last-name").text(pullLastName);
  $$("#display-my-email").text(pullMyMail);
  
    //app.dialog.alert(mainView.router.currentRoute.name);
    var cardDisplayJoin = "", cardDisplayJoin2 = "", cardHealthDisplayJoin = "";
    

    setTimeout(function(){
      fetchLatestBook1();
      fetchLatestBook2();
      fetchLatestHealthTip();
    }, 500);

      //Fetch latest book
      function fetchLatestBook1(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php',
       {
          book_name : "Manna",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        }, 
        function (data) {

           
           data = JSON.parse(data);
           
           for (var i = 0; i <= 0; i++) {
            var bookSN = data[i].book_sn;
             var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div class='card demo-card-header-pic animated fadeInUp' onclick=\"readThisBook(" + bookSN + ")\"><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><!-- <span>NGN750</span> --></div></div>";
             cardDisplayJoin += cardDisplay;

           }

            $$("#one-book").html(cardDisplayJoin);
                      
      }, function(){
            console.log("Unable to find request");
      });
    }


    function fetchLatestBook2(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php',
       {
          book_name : "Haman",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        }, 
        function (data) {

           
           data = JSON.parse(data);

           
           for (var i = 0; i <= 0; i++) {
            var bookSN = data[i].book_sn;
             var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div class='card demo-card-header-pic animated fadeInUp' onclick=\"readThisBook(" + bookSN + ")\"><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><!-- <span>NGN750</span> --></div></div>";
             cardDisplayJoin2 += cardDisplay;

           }

            $$("#two-book").html(cardDisplayJoin2);
                      
      }, function(){
            console.log("Unable to find request");
      });
    }



    function fetchLatestHealthTip(){
       app.request.json('https://ourdailymanna.org/xandercage/brexit/odmorg/list_health_tips.php',
        {
          "lang" : selectedLang
        },
        function (data) {

           console.log(data);
           
           for (var i = 0; i <= 0; i++) {
             var healthSN = data[i].sn;
             var topic = data[i].topic;
             var image = data[i].image;
             var content = data[i].content;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div onclick=\"readThisHealth(" + healthSN + ")\" class='card demo-card-header-pic animated fadeInLeft'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + image +")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + topic + "</span><br></div></div>";
             cardHealthDisplayJoin += cardDisplay;
           }

            $$("#one-health-tip").html(cardHealthDisplayJoin);
                      
      }, function(){
            console.log("Unable to find request");
      });
    }




    setTimeout(function(){
        showDP();
        
      }, 500);


      function showDP(){
      //Fetch and Set Profile Image
      if(window.localStorage.getItem("userLogo")){

        var theUserLogo = window.localStorage.getItem("userLogo");

          $$("#dashboard-dp-stand").prop("src", "https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + theUserLogo);
      }
      else{
      app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/fetch_user_dp.php', 
          { 
            "my_xserial_number" : permanentReg.user_serial,

          }, function (data) {
                if (data == "no dp") {
                  
                  $$(".dashboard-dp-container").css({

                    "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/avatar.png)"

                  });

                } else {

                  $$(".dashboard-dp-container").css({

                    "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + data + ")"

                  });
                }

        }, function(){

              app.dialog.alert("Could not fetch Profile Picture! Try Later");
        });
    }

  }






    if(!window.localStorage.getItem("version_control") || window.localStorage.getItem("version_control") != "1.5.0"){


      window.localStorage.setItem("version_control", "1.5.0");
    }
    

    var mycurrentVersion = window.localStorage.getItem("version_control");

    var updateALertLang = languagesEngine[selectedLang]["Software Update Available!"];


    //code to check for update version of the app
    app.request.get("https://ourdailymanna.org/xandercage/brexit/odmorg/version_control.php", function(datax){

        if(datax !== mycurrentVersion){

            app.dialog.confirm(updateALertLang + ' V' + datax, function () {
              
              var deviceType = app.theme;
              if (deviceType === "ios") {

                //Visit App Store

              }
              else{

                // Visit Google Play Store
                window.open("https://play.google.com/store/apps/details?id=org.ourdailymanna.odmmobile");
                
              }
          },
            function(){
               exitApp();
            });

        }

    });
       
       


});



$$(document).on('page:init', '.page[data-name="store"]', function (e){


  $$(".share-odm-btn").on("click", function(){
    shareODM();

  });


  var selectedLang = window.localStorage.getItem("language_select");
  var userCurrency = window.localStorage.getItem("country_currency");
  var userContinent = window.localStorage.getItem("country_continent");

  function runLang(){
    

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }
    
    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#store-back").text(languagesEngine[selectedLang][$$("#store-back").text()]);
    $$("#store-title").text(languagesEngine[selectedLang][$$("#store-title").text()]);
    $$("#browse-store-text").text(languagesEngine[selectedLang][$$("#browse-store-text").text()]);
    $$("#latest-book-texts").text(languagesEngine[selectedLang][$$("#latest-book-texts").text()]);
    $$("#series-text").text(languagesEngine[selectedLang][$$("#series-text").text()]);

    $$("#kids-text").text(languagesEngine[selectedLang][$$("#kids-text").text()]);
    $$("#audios-text").text(languagesEngine[selectedLang][$$("#audios-text").text()]);
    $$("#videos-text").text(languagesEngine[selectedLang][$$("#videos-text").text()]);

    }

    runLang();

  
    var cardBookDisplayJoin = "";

    setTimeout(function(){
      fetchLatestBooks();
    }, 500);


    function fetchLatestBooks(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php', 
        {
          book_name : "Manna",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        },
        function (data) {
           
           var data = JSON.parse(data);

           
           for (var i = 0; i <= 0; i++) {
            var bookSN = data[i].book_sn;
            var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div onclick=\"readThisBook(" + bookSN + ")\" style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div> <div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span>" + price + "</span></div>";
             cardBookDisplayJoin += cardDisplay;

           }

            $$("#latest-one-book").html(cardBookDisplayJoin);
           

            for (var i = 0; i < data.length; i++) { 
              var bookSN = data[i].book_sn;
              var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay2 = "<div onclick=\"readThisBook(" + bookSN + ")\" class='card demo-card-header-pic animated fadeInLeft'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='bottom' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span class='text-color-black'>" + price + "</span></div></div>";
             $$("#book-slide-" + i).html(cardDisplay2);

           }

           fetchLatestBooksHaman();
        
      }, function(){
            console.log("Unable to find request");
      });
    }





    function fetchLatestBooksHaman(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php', 
        {
          book_name : "Haman",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        },
        function (data) {
           
           var data = JSON.parse(data);

            for (var i = 0; i < data.length; i++) { 
              var bookSN = data[i].book_sn;
              var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay3 = "<div onclick=\"readThisBook(" + bookSN + ")\" class='card demo-card-header-pic animated fadeInLeft'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='bottom' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span class='text-color-black'>" + price + "</span></div></div>";
             $$("#haman-book-slide-" + i).html(cardDisplay3);

             
           }

           fetchLatestODMKids();

        
      }, function(){
            console.log("Unable to find request");
      });
    }






    function fetchLatestODMKids(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php', 
        {
          book_name : "Kids",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        },
        function (data) {
           
           var data = JSON.parse(data);

            for (var i = 0; i < data.length; i++) { 
              var bookSN = data[i].book_sn;
              var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay4 = "<div onclick=\"readThisBook(" + bookSN + ")\" class='card demo-card-header-pic animated fadeInLeft'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='bottom' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span class='text-color-black'>" + price + "</span></div></div>";
             $$("#kids-book-slide-" + i).html(cardDisplay4);

             
           }

           fetchLatestAudio();

        
      }, function(){
            console.log("Unable to find request");
      });
    }





    function fetchLatestAudio(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_audios.php', 
        function (data) {
           
           var data = JSON.parse(data);
            console.log(data);
          

            for (var i = 0; i < data.length; i++) { 

            var audioSN = data[i].audio_sn;
            var audioName = data[i].audio_name;
            var audioDescription = data[i].audio_description;
             var audioThumbnail = data[i].audio_thumbnail;
             var audioUrl = data[i].audio_url;
             var audioLength = data[i].audio_length;
             var releaseDate = data[i].release_date;

             var calcLength = audioLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = audioLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds";
             
             var cardDisplay4 = "<div onclick=readThisAudio(" + audioSN + ") class='card demo-card-header-pic animated fadeInLeft'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + audioThumbnail + ")' valign='bottom' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-black'>" + audioName + "</span><br><small class='text-color-gray'>" + calcLengthDisplay + "</small></div></div>";
             $$("#audio-slide-" + i).html(cardDisplay4);
             
           }

           fetchLatestVideo();
             
        
      }, function(){
            console.log("Unable to find request");
      });
    }

  

    function fetchLatestVideo(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_videos.php', 
        function (data) {
           
           
           var data = JSON.parse(data);

            for (var i = 0; i < data.length; i++) { 

            var videoSN = data[i].video_sn;
            var videoName = data[i].video_name;
             var videoThumbnail = data[i].video_thumbnail;
             var videoUrl = data[i].video_url;
             var videoLength = data[i].video_length;
             var releaseDate = data[i].release_date;

             var calcLength = videoLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = videoLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds"; 

             var cardDisplay5 = "<div onclick=readThisVideo(" + videoSN + ") class='card demo-card-header-pic animated fadeInLeft'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + videoThumbnail + ")' valign='bottom' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-black'>" + videoName + "</span><br><small class='text-color-gray'>" + calcLengthDisplay + "</small></div></div>";
             $$("#video-slide-" + i).html(cardDisplay5);

             
           }

        
      }, function(){
            console.log("Unable to find request");
      });
    }





});






$$(document).on('page:init', '.page[data-name="manna"]', function (e){

  var selectedLang = window.localStorage.getItem("language_select");
  var userCurrency = window.localStorage.getItem("country_currency");
  var userContinent = window.localStorage.getItem("country_continent");



  function runLang(){

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#manna-back").text(languagesEngine[selectedLang][$$("#manna-back").text()]);
    $$("#store-text").text(languagesEngine[selectedLang][$$("#store-text").text()]);
    $$("#books-text").text(languagesEngine[selectedLang][$$("#books-text").text()]);
    $$("#seriesz-text").text(languagesEngine[selectedLang][$$("#seriesz-text").text()]);

    $$("#kids-text").text(languagesEngine[selectedLang][$$("#kids-text").text()]);
    $$("#latest-book-text").text(languagesEngine[selectedLang][$$("#latest-book-text").text()]);

    

  }

  runLang();





  setTimeout(function(){
      fetchLatestBooks();
    }, 500);


    var cardBookDisplayJoin = "", cardDisplayJoin2 = "";

   function fetchLatestBooks(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php', 
        {
          book_name : "Manna",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        },
        function (data) {
           
           var data = JSON.parse(data);

           console.log(data);

           
           for (var i = 0; i <= 0; i++) {
            var bookSN = data[i].book_sn;
            var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div onclick=\"readThisBook(" + bookSN + ")\" style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div> <div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span>" + price + "</span></div>";
             cardBookDisplayJoin += cardDisplay;

           }

            $$("#latest-one-odm-book").html(cardBookDisplayJoin);
           

            for (var i = 0; i < data.length; i++) { 
              var bookSN = data[i].book_sn;
              var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay2 = "<div class='col-50'><div onclick=\"readThisBook(" + bookSN + ")\" class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span>" + price + "</span></div></div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#all-odm-series").html(cardDisplayJoin2);
        
      }, function(){
            console.log("Unable to find request");
      });
    }

    
});









$$(document).on('page:init', '.page[data-name="haman"]', function (e){


  var selectedLang = window.localStorage.getItem("language_select");
  var userCurrency = window.localStorage.getItem("country_currency");
  var userContinent = window.localStorage.getItem("country_continent");

  

  function runLang(){

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#haman-back").text(languagesEngine[selectedLang][$$("#haman-back").text()]);
    $$("#haman-store-text").text(languagesEngine[selectedLang][$$("#haman-store-text").text()]);
    $$("#book-text").text(languagesEngine[selectedLang][$$("#book-text").text()]);
    $$("#books-text").text(languagesEngine[selectedLang][$$("#books-text").text()]);
    $$("#seriess-text").text(languagesEngine[selectedLang][$$("#seriess-text").text()]);

    $$("#kids-text").text(languagesEngine[selectedLang][$$("#kids-text").text()]);
    $$("#latest-book-text").text(languagesEngine[selectedLang][$$("#latest-book-text").text()]);

    

  }


  runLang();

  setTimeout(function(){
      fetchLatestBooks();
    }, 500);


    var cardBookDisplayJoin = "", cardDisplayJoin2 = "";

   function fetchLatestBooks(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php', 
        {
          book_name : "Haman",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        },
        function (data) {
           
           var data = JSON.parse(data);

           console.log(data);

           
           for (var i = 0; i <= 0; i++) {
            var bookSN = data[i].book_sn;
            var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div onclick=\"readThisBook(" + bookSN + ")\" style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div> <div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span>" + price + "</span></div>";
             cardBookDisplayJoin += cardDisplay;

           }

            $$("#latest-one-haman-book").html(cardBookDisplayJoin);
           

            for (var i = 0; i < data.length; i++) { 
              var bookSN = data[i].book_sn;
              var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay2 = "<div onclick=\"readThisBook(" + bookSN + ")\" class='col-50'><div class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span>" + price + "</span></div></div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#all-haman-series").html(cardDisplayJoin2);
        
      }, function(){
            console.log("Unable to find request");
      });
    }

    
});













$$(document).on('page:init', '.page[data-name="kids"]', function (e){

  var selectedLang = window.localStorage.getItem("language_select");
  var userCurrency = window.localStorage.getItem("country_currency");
  var userContinent = window.localStorage.getItem("country_continent");



  function runLang(){

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#haman-back").text(languagesEngine[selectedLang][$$("#haman-back").text()]);
    $$("#haman-store-text").text(languagesEngine[selectedLang][$$("#haman-store-text").text()]);
    $$("#book-text").text(languagesEngine[selectedLang][$$("#book-text").text()]);
    $$("#books-text").text(languagesEngine[selectedLang][$$("#books-text").text()]);
    $$("#seriesj-text").text(languagesEngine[selectedLang][$$("#seriesj-text").text()]);

    $$(".kids-text").text(languagesEngine[selectedLang][$$(".kids-text").text()]);
    $$("#latest-book-text").text(languagesEngine[selectedLang][$$("#latest-book-text").text()]);

    

  }

  runLang();


  setTimeout(function(){
      fetchLatestBooks();
    }, 500);


    var cardBookDisplayJoin = "", cardDisplayJoin2 = "";

   function fetchLatestBooks(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_books.php', 
        {
          book_name : "Kids",
          lang : selectedLang,
          currency : userCurrency,
          continent : userContinent
        },
        function (data) {
           
           var data = JSON.parse(data);

           console.log(data);

           
           for (var i = 0; i <= 0; i++) {
            var bookSN = data[i].book_sn;
            var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div onclick=\"readThisBook(" + bookSN + ")\" style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div> <div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span>" + price + "</span></div>";
             cardBookDisplayJoin += cardDisplay;

           }

            $$("#latest-one-kids-book").html(cardBookDisplayJoin);
           

            for (var i = 0; i < data.length; i++) { 
              var bookSN = data[i].book_sn;
              var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay2 = "<div onclick=\"readThisBook(" + bookSN + ")\" class='col-50'><div class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span><br><span>" + price + "</span></div></div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#all-kids-series").html(cardDisplayJoin2);
        
      }, function(){
            console.log("Unable to find request");
      });
    }

    
});















$$(document).on('page:init', '.page[data-name="health"]', function (e){

  $$(".share-odm-btn").on("click", function(){
    shareODM();

  });

var selectedLang = window.localStorage.getItem("language_select");


function runLang(){
    

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#health-back-text").text(languagesEngine[selectedLang][$$("#health-back-text").text()]);
    $$("#health-text").text(languagesEngine[selectedLang][$$("#health-text").text()]);
    $$("#health-tips-text").text(languagesEngine[selectedLang][$$("#health-tips-text").text()]);
    $$("#latest-tip-text").text(languagesEngine[selectedLang][$$("#latest-tip-text").text()]);
    $$("#ht-text").text(languagesEngine[selectedLang][$$("#ht-text").text()]);
}

runLang();




  setTimeout(function(){
      fetchLatestHealthTips();
    }, 500);


    var cardBookDisplayJoin = "", cardDisplayJoin2 = "";

   function fetchLatestHealthTips(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_health_tips.php',
        {
          "lang" : selectedLang
        },
        function (data) {
           
           var data = JSON.parse(data);

           console.log(data);

           
           for (var i = 0; i <= 0; i++) {
            var healthSN = data[i].sn;
            var healthName = data[i].topic;
             var healthThumbnail = data[i].image;
             var healthContent = data[i].content;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div onclick=\"readThisHealth(" + healthSN + ")\" style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + healthThumbnail + ")' valign='top' class='card-header'></div> <div class='card-content card-content-padding'><span class='text-color-gray'>" + healthName + "</span></div>";
             cardBookDisplayJoin += cardDisplay;

           }

            $$("#latest-one-health").html(cardBookDisplayJoin);
           

            for (var i = 0; i < data.length; i++) { 
              var healthSN = data[i].sn;
            var healthName = data[i].topic;
             var healthThumbnail = data[i].image;
             var healthContent = data[i].content;
             var releaseDate = data[i].release_date;

             var cardDisplay2 = "<div onclick=\"readThisHealth(" + healthSN + ")\" class='col-50'><div class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + healthThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + healthName + "</span></div></div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#all-health-series").html(cardDisplayJoin2);
        
      }, function(){
            app.dialog.alert("Network Error. Try again later");
      });
    }

    
});







$$(document).on('page:init', '.page[data-name="audios"]', function (e){


  $$(".share-odm-btn").on("click", function(){
    shareODM();

  });


  var selectedLang = window.localStorage.getItem("language_select");

  function runLang(){
    

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#haman-back").text(languagesEngine[selectedLang][$$("#haman-back").text()]);
    $$("#haman-store-text").text(languagesEngine[selectedLang][$$("#haman-store-text").text()]);
    $$("#audios-text").text(languagesEngine[selectedLang][$$("#audios-text").text()]);
    $$("#seriesx-text").text(languagesEngine[selectedLang][$$("#seriesx-text").text()]);

    $$("#latest-text").text(languagesEngine[selectedLang][$$("#latest-text").text()]);
    

    

  }

  runLang();


  setTimeout(function(){
      fetchLatestAudio();
    }, 500);


    var audioCardDisplay = "";

function fetchLatestAudio(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_audios.php',
       {
        lang : selectedLang
       },
        function (data) {
           
            console.log(data);

           var data = JSON.parse(data);


           for (var i = 0; i <= 0; i++) { 

            var audioSN = data[i].audio_sn;
            var audioName = data[i].audio_name;
             var audioThumbnail = data[i].audio_thumbnail;
             var audioUrl = data[i].audio_url;
             var audioLength = data[i].audio_length;
             var releaseDate = data[i].release_date;

             var calcLength = audioLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = audioLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds"; 

             var audioLatest = "<div onclick=readThisAudio(" + audioSN + ") style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + audioThumbnail + ")' valign='bottom' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-black'>" + audioName + "</span><br><small class='text-color-gray'>" + calcLengthDisplay + "</small></div>";
             $$("#latest-audio-file").html(audioLatest);

           }
          

            for (var i = 0; i < data.length; i++) { 

            var audioSN = data[i].audio_sn;
            var audioName = data[i].audio_name;
             var audioThumbnail = data[i].audio_thumbnail;
             var audioUrl = data[i].audio_url;
             var audioLength = data[i].audio_length;
             var releaseDate = data[i].release_date;

             var calcLength = audioLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = audioLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds"; 

             audioCardDisplay += "<div onclick=readThisAudio(" + audioSN + ") class='col-50'><div class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + audioThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + audioName + "</span><br><span>" + calcLengthDisplay + "</span></div></div></div>";
          
             
           }

           $$("#all-audio-series").html(audioCardDisplay);

        
      }, function(){
            console.log("Unable to find request");
      });
    }


    
});









$$(document).on('page:init', '.page[data-name="videos"]', function (e){

  $$(".share-odm-btn").on("click", function(){
    shareODM();

  });

  var selectedLang = window.localStorage.getItem("language_select");

  function runLang(){
    
  var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#haman-back").text(languagesEngine[selectedLang][$$("#haman-back").text()]);
    $$("#haman-store-text").text(languagesEngine[selectedLang][$$("#haman-store-text").text()]);
    $$(".videos-text").text(languagesEngine[selectedLang][$$(".videos-text").text()]);
    $$("#series-text").text(languagesEngine[selectedLang][$$("#series-text").text()]);

    $$("#series-text").text(languagesEngine[selectedLang][$$("#series-text").text()]);

    

  }

  runLang();

  setTimeout(function(){
      fetchLatestVideo();
    }, 500);


    var videoCardDisplay = "";

function fetchLatestVideo(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_videos.php', 
         {
        lang : selectedLang
       },
        function (data) {
           
            console.log(data);

           var data = JSON.parse(data);


           for (var i = 0; i <= 0; i++) { 

            var videoSN = data[i].video_sn;
            var videoName = data[i].video_name;
             var videoThumbnail = data[i].video_thumbnail;
             var videoUrl = data[i].video_url;
             var videoLength = data[i].video_length;
             var releaseDate = data[i].release_date;

             var calcLength = videoLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = videoLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds"; 

             var videoLatest = "<div onclick=readThisVideo(" + videoSN + ") style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + videoThumbnail + ")' valign='bottom' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-black'>" + videoName + "</span><br><small class='text-color-gray'>" + calcLengthDisplay + "</small></div>";
             $$("#latest-video-file").html(videoLatest);

           }
          

            for (var i = 0; i < data.length; i++) { 
            var videoSN = data[i].video_sn;
            var videoName = data[i].video_name;
             var videoThumbnail = data[i].video_thumbnail;
             var videoUrl = data[i].video_url;
             var videoLength = data[i].video_length;
             var releaseDate = data[i].release_date;

             var calcLength = videoLength / 60;
             calcLength = Math.floor(calcLength);
             var calcLengthRem = videoLength % 60;

             var calcLengthDisplay = calcLength + " Minute(s) " + calcLengthRem + " seconds"; 

             videoCardDisplay += "<div onclick=readThisVideo(" + videoSN + ") class='col-50'><div class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + videoThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + videoName + "</span><br><span>" + calcLengthDisplay + "</span></div></div></div>";
          
             
           }

           $$("#all-video-series").html(videoCardDisplay);

        
      }, function(){
            console.log("Unable to find request");
      });
    }


    
});








$$(document).on('page:init', '.page[data-name="settings"]', function (e){




   

  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#profile-n-notif").text(languagesEngine[selectedLang][$$("#profile-n-notif").text()]);
    $$("#update-profile-text").text(languagesEngine[selectedLang][$$("#update-profile-text").text()]);
    $$("#settings-password-text").text(languagesEngine[selectedLang][$$("#settings-password-text").text()]);
    $$("#profile-settings-text").text(languagesEngine[selectedLang][$$("#profile-settings-text").text()]);
    $$("#settings-password-text").text(languagesEngine[selectedLang][$$("#settings-password-text").text()]);
    $$("#change-password-text").text(languagesEngine[selectedLang][$$("#change-password-text").text()]);
    $$("#my-purchases-text").text(languagesEngine[selectedLang][$$("#my-purchases-text").text()]);
    $$("#view-text").text(languagesEngine[selectedLang][$$("#view-text").text()]);
    $$("#contact-n-support").text(languagesEngine[selectedLang][$$("#contact-n-support").text()]);
    $$("#social-media-text").text(languagesEngine[selectedLang][$$("#social-media-text").text()]);
    $$("#contact-twitter-text").text(languagesEngine[selectedLang][$$("#contact-twitter-text").text()]);
    $$("#help-text").text(languagesEngine[selectedLang][$$("#help-text").text()]);
    $$("#tnc-text").text(languagesEngine[selectedLang][$$("#tnc-text").text()]);
    $$("#ptnc-text").text(languagesEngine[selectedLang][$$("#ptnc-text").text()]);
    $$("#about-settings").text(languagesEngine[selectedLang][$$("#about-settings").text()]);
    $$("#settings-logout-text").text(languagesEngine[selectedLang][$$("#settings-logout-text").text()]);
    $$("#settings-logout-text-2").text(languagesEngine[selectedLang][$$("#settings-logout-text-2").text()]);

    $$("#settings-back").text(languagesEngine[selectedLang][$$("#settings-back").text()]);
    $$("#account-settings-text").text(languagesEngine[selectedLang][$$("#account-settings-text").text()]);


}


  runLang();

    //Find permanent reg
      var permanentReg = window.localStorage.getItem("permanentReg");
      permanentReg = JSON.parse(permanentReg);
      var pullFirstName = permanentReg.first_name;
      var pullLastName = permanentReg.last_name;
      var pullMail = permanentReg.email;
      var pullUserSerial = permanentReg.user_serial;

      $$("#visual-first-name").text(pullFirstName);
      $$("#visual-last-name").text(pullLastName);
      $$("#visual-email").text(pullMail);


      $$("#logout-btn").on("click", function(){
        app.dialog.preloader("Logging Out...");
        window.localStorage.removeItem("permanentReg");
        setTimeout(function(){
          app.dialog.close();
          mainView.router.navigate("/main/");
        }, 5000);
      });


      setTimeout(function(){
        showDP();
        
      }, 500);


      function showDP(){
      //Fetch and Set Profile Image
      if(window.localStorage.getItem("userLogo")){

        var theUserLogo = window.localStorage.getItem("userLogo");

          $$("#user-profile-stand").prop("src", "https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + theUserLogo);
      }
      else{
      app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/fetch_user_dp.php', 
          { 
            "my_xserial_number" : permanentReg.user_serial,

          }, function (data) {
                if (data == "no dp") {
                  
                  $$(".dp-container").css({

                    "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/avatar.png)"

                  });

                } else {

                  $$(".dp-container").css({

                    "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + data + ")"

                  });
                }

        }, function(){

              app.dialog.alert("Could not fetch Profile Picture! Try Later");
        });
    }

  }





});





$$(document).on('page:init', '.page[data-name="editprofile"]', function (e){




  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#edit-profile-back").text(languagesEngine[selectedLang][$$("#edit-profile-back").text()]);
    $$("#edit-profile-title").text(languagesEngine[selectedLang][$$("#edit-profile-title").text()]);
    $$("#edit-profile-text").text(languagesEngine[selectedLang][$$("#edit-profile-text").text()]);
    $$("#update-first-name").prop("placeholder", languagesEngine[selectedLang][$$("#update-first-name").prop("placeholder")]);
    $$("#update-last-name").prop("placeholder", languagesEngine[selectedLang][$$("#update-last-name").prop("placeholder")]);
    $$("#update-profile-btn").text(languagesEngine[selectedLang][$$("#update-profile-btn").text()]);
    
    

}

  runLang();

    //Find permanent reg
      var permanentReg = window.localStorage.getItem("permanentReg");
      permanentReg = JSON.parse(permanentReg);
      var pullFirstName = permanentReg.first_name;
      var pullLastName = permanentReg.last_name;
      var pullMail = permanentReg.email;

      $$("#visual-edit-first-name").text(pullFirstName);
      $$("#visual-edit-last-name").text(pullLastName);
      $$("#visual-edit-email").text(pullMail);

      $$("#update-first-name").val(pullFirstName);
      $$("#update-last-name").val(pullLastName);
      $$("#update-email").val(pullMail);





    $$("#update-profile").on("click", function(){

      $$("#update-profile").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "disabled");

      //Grab box content and LoacalStorage Content
      var updateFirstName = $$("#update-first-name").val();
      var updateLastName = $$("#update-last-name").val();
      
         
            if (updateFirstName.trim() === "" || updateLastName.trim() === "") {

               $$("#update-profile").html("<i class='icon f7-icons ios-only'>person</i><i class='icon material-icons md-only'>account_circle</i>&nbsp;Update Profile").prop("disabled", false);
                app.dialog.alert("Please complete the form");
            }
            else{

              //Once otp is correct, call on registration hub
              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/user_profile_update.php', 
                { 
                  "my_xserial_number" : permanentReg.user_serial,
                  "user_edit_first_name" : updateFirstName,
                  "user_edit_last_name" : updateLastName

                }, function (data) {

                      if (data== "Update Successful") {

                        //Build a permanent LocalStorage again
                          var newPermanentReg = {
                            user_serial : permanentReg.user_serial,
                            first_name : updateFirstName,
                            last_name : updateLastName,
                            email : permanentReg.email,
                            password : permanentReg.password,
                            country : permanentReg.country,
                            phone_number : permanentReg.phone_number
                          }

                          newPermanentReg = JSON.stringify(newPermanentReg);
                          window.localStorage.setItem("permanentReg", newPermanentReg);

                          $$("#update-profile").html("<i class='icon f7-icons ios-only'>person</i><i class='icon material-icons md-only'>account_circle</i>&nbsp;Update Profile").prop("disabled", false);
                          app.dialog.alert("Profile Update Successful");
                      }
                      else{

                        app.dialog.alert(data);
                        $$("#update-profile").html("<i class='icon f7-icons ios-only'>person</i><i class='icon material-icons md-only'>account_circle</i>&nbsp;Update Profile").prop("disabled", false);

                      }

              }, function(){
                    $$("#update-profile").html("<i class='icon f7-icons ios-only'>person</i><i class='icon material-icons md-only'>account_circle</i>&nbsp;Update Profile").prop("disabled", false);
                    app.dialog.alert("Profile Update Failed! Try Later");
              });

              
             
                
            }
          
    });







      $$("#change-dp").on("click", function(){

          getImg4rmGallery();

      });






      setTimeout(function(){
        showDP();
        
      }, 500);


      function showDP(){
      //Fetch and Set Profile Image
      if(window.localStorage.getItem("userLogo")){

        var theUserLogo = window.localStorage.getItem("userLogo");

          $$("#current-dp").prop("src", "https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + theUserLogo);
      }
      else{
      app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/fetch_user_dp.php', 
          { 
            "my_xserial_number" : permanentReg.user_serial,

          }, function (data) {
                if (data == "no dp") {
                  
                  $$(".dp-container").css({

                    "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/avatar.png)"

                  });

                } else {

                  $$(".dp-container").css({

                    "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + data + ")"

                  });
                }

        }, function(){

              app.dialog.alert("Could not fetch Profile Picture! Try Later");
        });
    }

  }



});









$$(document).on('page:init', '.page[data-name="changepassword"]', function (e){



  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#cp-back").text(languagesEngine[selectedLang][$$("#cp-back").text()]);
    $$("#update-password-text").text(languagesEngine[selectedLang][$$("#update-password-text").text()]);
    $$("#current-password").prop("placeholder", languagesEngine[selectedLang][$$("#current-password").prop("placeholder")]);
    $$("#new-password").prop("placeholder", languagesEngine[selectedLang][$$("#new-password").prop("placeholder")]);
    $$("#new-password-confirm").prop("placeholder", languagesEngine[selectedLang][$$("#new-password-confirm").prop("placeholder")]);
    $$("#up-text").text(languagesEngine[selectedLang][$$("#up-text").text()]);
    
    
    $$("#update-p").text(languagesEngine[selectedLang][$$("#update-p").text()]);
    
    

}

runLang();

      
      //Find permanent reg
      var permanentReg = window.localStorage.getItem("permanentReg");
      permanentReg = JSON.parse(permanentReg);
      


     $$("#update-password").on("click", function(){

      $$("#update-password").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "disabled");

      //Grab box content and LoacalStorage Content
      var currentPassword = $$("#current-password").val();
      var newPassword = $$("#new-password").val();
      var newPasswordConfirm = $$("#new-password-confirm").val();
      
         
            if (currentPassword.trim() === "" || newPassword.trim() === "" || newPasswordConfirm.trim() === "") {

               $$("#update-password").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                app.dialog.alert("Please complete the form");
            }
            else if (newPassword.trim() != newPasswordConfirm.trim()) {

               $$("#update-password").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                app.dialog.alert("Passwords don't match. Try Again");
            }
            else{

              //Once otp is correct, call on registration hub
              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/change_password.php', 
                { 
                  "my_xserial_number" : permanentReg.user_serial,
                  "current_password" : currentPassword,
                  "new_password" : newPassword,

                }, function (data) {

                      if (data== "Password Change Successful") {

                          $$("#update-password").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                          app.dialog.alert("Password Update Successful");
                      }
                      else{

                        app.dialog.alert(data);
                        $$("#update-password").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);

                      }

              }, function(){
                    $$("#update-password").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                    app.dialog.alert("Password Update Failed!");
              });

                  
            }
          
    });


});




$$(document).on('page:init', '.page[data-name="read"]', function (e){



  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#swipe").text(languagesEngine[selectedLang][$$("#swipe").text()]);    
  
}

runLang();


                   
  var swiper = new Swiper('.reading-slide', {
          speed: 400,
          spaceBetween: 100
  });

      
      //Find permanent reg
      var theBook = window.localStorage.getItem("theBookToRead");
      theBook = JSON.parse(theBook);
      
      bookSN = theBook.bookSN;
      bookName = theBook.bookName;
      bookThumbnail = theBook.bookThumbnail;
      bookContent = theBook.bookContent;
      bookReleaseDate = theBook.releaseDate;

      $$("#book-title").text(bookName);
      $$("#book-title-space").html("<h2 class='text-color-black'>" + bookName + "<br><br>Edition: <br>" + bookReleaseDate + "</h2>");
      $$("#book-thumbnail-space").html("<div class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div></div>");
      
     

      //Now butcher the book content
      //var splitBookContent = bookContent.split(" ");
      
       /* var oneWord = "";
          for (var i = 0; i < splitBookContent.length; i++) {
              
              oneWord += splitBookContent[i] + "  ";
              if ((i % 120) === 0 && i != 0) { 
                swiper.appendSlide("<div class='swiper-slide block prevent-copy' style='font-size:16px !important;padding-bottom:25px !important;'>" + oneWord + "</div>");
                oneWord = "";
              }
          }
*/
      
  $$("#read-content").html(bookContent);
  

  $$("#read-content").on("scroll", function(){
    window.localStorage.setItem("resumeBook" + bookSN, $$("#read-content").scrollTop());
  });

          if (window.localStorage.getItem("resumeBook" + bookSN)) {
            
            var lastBookMemory = window.localStorage.getItem("resumeBook" + bookSN);
            $$("#read-content").scrollTop(lastBookMemory);

          }

          
           //Text to Speech
      $$("#text-to-speech-speaker").on("click", function(){
        readTextToSpeech(bookContent);
      });


      //Stop Text to Speech
      $$("#stop-text-to-speech").on("click", function(){
        stopTextToSpeech();
      });
          
          
        
          $$("#close-read-page").on("click", function(){
              stopTextToSpeech();
          })
  

});







$$(document).on('page:init', '.page[data-name="login"]', function (e){

 

  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#login-text").text(languagesEngine[selectedLang][$$("#login-text").text()]);
    $$("#login-email-text").text(languagesEngine[selectedLang][$$("#login-email").text()]);
    $$("#login-password-text").text(languagesEngine[selectedLang][$$("#login-password").text()]);
    $$("#login-btn-text").text(languagesEngine[selectedLang][$$("#login-btn-text").text()]);
    $$("#dont-have-acc").text(languagesEngine[selectedLang][$$("#dont-have-acc").text()]);
    $$("#forgot-pass-text").text(languagesEngine[selectedLang][$$("#forgot-pass-text").text()]);
    $$("#login-support-text").text(languagesEngine[selectedLang][$$("#login-support-text").text()]);
}

runLang();



        $$("#login-form").on("submit", function(){

              $$("#login-btn").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "diabled");             

              
              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/user_login.php', 
                { 
                 
                  "user_mail": $$("#login-email").val(),
                  "user_password": $$("#login-password").val(),
                  

                }, function (data) {

                      if (data != "Invalid Login Details") {
                        console.log(data);
                        var user_json_data = JSON.parse(data);
                        console.log(data);

                        //Build a permanent LocalStorage for registered users
                          var permanentReg = {
                            user_serial : user_json_data.user_serial,
                            first_name : user_json_data.first_name,
                            last_name : user_json_data.last_name,
                            email : user_json_data.user_mail,
                            country : user_json_data.user_country,
                            phone_number : user_json_data.user_phone
                          }

                          permanentReg = JSON.stringify(permanentReg);
                          window.localStorage.setItem("permanentReg", permanentReg);

                          var countryName = user_json_data.user_country;
                         
                          for (var i = 0; i < countries.length; i++) {

                          
                            if(countryName == countries[i].name){

                              var countryISOCode = countries[i].code;
                              window.localStorage.setItem("country_code", countryISOCode);

                              //capture currency from country code as well
                              var countryCurrency = countriesEngine[countryISOCode]['currency'];
                              window.localStorage.setItem("country_currency", countryCurrency);

                              //Capture country's continent as well
                              var countryContinent = countriesEngine[countryISOCode]['continent'];
                              var realContinent = continents[countryContinent];
                              window.localStorage.setItem("country_continent", realContinent);

                              window.localStorage.setItem("country_name", countryName);

                              break;
                              
                            }

                          }

                            $$("#login-password").val("");

                            setTimeout(function(){
                              mainView.router.navigate("/dashboard/");
                            }, 3000);
                      }
                      else{

                        app.dialog.alert(data);
                        $$("#login-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Login").prop("disabled", false);

                      }

              }, function(){
                    console.log("Network Error!. Try again later");
              });


                
          });

           

         

});









$$(document).on('page:init', '.page[data-name="recpassword"]', function (e){


  



  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#pass-rec-text").text(languagesEngine[selectedLang][$$("#pass-rec-text").text()]);
    $$("#rec-country").text(languagesEngine[selectedLang][$$("#rec-country").text()]);
    $$("#rec-phone").text(languagesEngine[selectedLang][$$("#rec-phone").text()]);
    $$("#rec-acc-text").text(languagesEngine[selectedLang][$$("#rec-acc-text").text()]);
    $$("#have-acc-text").text(languagesEngine[selectedLang][$$("#have-acc-text").text()]);
    $$("#login-support-text").text(languagesEngine[selectedLang][$$("#login-support-text").text()]);
}

runLang();






  for (var i = 0; i < countries.length; i++) {
    var countryName = countries[i].name;
    var countryCode = countries[i].dial_code;
    $$("#recovery-countries").append("<option value='" + countryName + " " + countryCode + "'>" + countryName + " " + countryCode + "</option>");
  }

var splitWhatWasSelected = "";
var smartSelect = app.smartSelect.create({
              el : '.select-country',
              closeOnSelect : true,
              navbarColorTheme : 'black',
              formColorTheme : 'black',
              searchbar : true,
              searchbarPlaceholder : 'Search Country',
              pageTitle : 'Select Country',
              openIn : 'popup',
              popupCloseLinkText : 'Done',
              appendSearchbarNotFound : '<div class="block searchbar-not-found">Country not found!</div>',
              on : {
              closed : function(){
                var whatWasSelected = $$(".item-after").html();
                splitWhatWasSelected = whatWasSelected.split(" ");
                var country = splitWhatWasSelected[0];
                var tempCountry = window.localStorage.setItem("temp_country", country);
                
              }
            }
        });





  
$$("#recovery-btn").on("click", function(){

  var userPhone = $$("#recovery-phone").val();
  var realPhoneNumber = splitWhatWasSelected[splitWhatWasSelected.length - 1] + userPhone;
  console.log(realPhoneNumber);

  $$("#recovery-btn").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", false);
  //$$("#recovery-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Recover Account").prop("disabled", false);
   app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/recover_account.php',
                { 
                 
                  "user_phone": realPhoneNumber,                

                }, function (data) {

                  data = data.split(" ");

                      if (data[1] == "Successful") {
                          
                          window.localStorage.setItem("recovery_serial", data[2]);
                          xendRecoveryCode(realPhoneNumber);                    
                       }
                       else{
                          app.dialog.alert(data);
                          $$("#recovery-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Recover Account").prop("disabled", false);
                       }

              }, function(){
                    console.log("Network Error! Try again later");
              });


});



    function xendRecoveryCode(thePhoneNumber){

        app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/generate_code.php',
                { 
                 
                  "user_phone": $$("#recovery-phone").val(),                

                }, function (data) {

                    window.localStorage.setItem("tem_recovery_code", data);
                    runSMSXend(data, thePhoneNumber);

              }, function(){
                    console.log("Network Error! Try again later");
              });
    }






    function runSMSXend(theOTPCode, thePhoneNumber){
     

              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/xender.php', 
                { 
                  "phone_number": thePhoneNumber,
                  "message" : "Our Daily Manna. Your recovery code is " + theOTPCode
                }, function (data) {

                   console.log(data);                   
                   mainView.router.navigate("/enterreccode/");

              }, function(){
                    console.log("Registration error occured. Try again later");
              });

            }







});














$$(document).on('page:init', '.page[data-name="enterreccode"]', function (e){





  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#rec-code-back").text(languagesEngine[selectedLang][$$("#rec-code-back").text()]);
    $$("#acc-rec-text").text(languagesEngine[selectedLang][$$("#acc-rec-text").text()]);
    $$("#enter-code-text").text(languagesEngine[selectedLang][$$("#enter-code-text").text()]);
    $$("#we-texted-you-access").text(languagesEngine[selectedLang][$$("#we-texted-you-access").text()]);
    $$("#enter-code-verify").text(languagesEngine[selectedLang][$$("#enter-code-verify").text()]);
}
runLang();




$$("#verify-otp").on("click", function(){

      $$("#verify-otp").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "disabled");

      //Grab box content and LoacalStorage Content
      var suppliedOtp = $$("#supply-otp-box").val();
      var concurrentOtp = window.localStorage.getItem("tem_recovery_code");
      concurrentOtp = parseInt(concurrentOtp);

    
            if (suppliedOtp == concurrentOtp){

                mainView.router.navigate("/updatepassword/");          
             
                
            }
            else{

              $$("#verify-otp").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Verify Code").prop("disabled", false);
              app.dialog.alert("Inavalid OTP supplied");
            }
            
    });



});








$$(document).on('page:init', '.page[data-name="updatepassword"]', function (e){




  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#update-pass-back").text(languagesEngine[selectedLang][$$("#update-pass-back").text()]);
    $$("#update-acc-rec").text(languagesEngine[selectedLang][$$("#update-acc-rec").text()]);
    $$("#create-pass").text(languagesEngine[selectedLang][$$("#create-pass").text()]);
    $$("#new-password").prop("placeholder", languagesEngine[selectedLang][$$("#new-password").prop("placeholder")]);
    $$("#new-password-confirm").prop("placeholder", languagesEngine[selectedLang][$$("#new-password-confirm").prop("placeholder")]);
    $$("#update-rec").text(languagesEngine[selectedLang][$$("#update-rec").text()]);
}

runLang();



    $$("#update-password-btn").on("click", function(){

      $$("#update-password-btn").html("<img src='https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/spinner.gif' style='max-height:50px;'>").prop("disabled", "disabled");

      //Grab box content and LoacalStorage Conten
      var newPassword = $$("#new-password").val();
      var newPasswordConfirm = $$("#new-password-confirm").val();
      
         
            if (newPassword.trim() === "" || newPasswordConfirm.trim() === "") {

               $$("#update-password-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                app.dialog.alert("Please complete the form");
            }
            else if (newPassword.trim() != newPasswordConfirm.trim()) {

               $$("#update-password-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                app.dialog.alert("Passwords don't match. Try Again");
            }
            else{
              //Once otp is correct, call on registration hub
              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/update_password.php', 
                { 
                  "my_xserial_number" : window.localStorage.getItem("recovery_serial"),
                  "new_password" : newPassword,

                }, function (data) {

                      if (data == "Password Change Successful") {

                          $$("#update-password-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                          app.dialog.alert("Password Update Successful");
                          mainView.router.navigate("/login/");
                      }
                      else{

                        app.dialog.alert(data);
                        $$("#update-password-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);

                      }

              }, function(){
                    $$("#update-password-btn").html("<i class='icon f7-icons ios-only'>lock</i><i class='icon material-icons md-only'>lock_outline</i>&nbsp;Update Password").prop("disabled", false);
                    app.dialog.alert("Password Update Failed!");
              });

                  
            }
          
    });




});












$$(document).on('page:init', '.page[data-name="preview"]', function (e){

    function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#words").text(languagesEngine[selectedLang][$$("#words").text()]);
    $$("#reads").text(languagesEngine[selectedLang][$$("#reads").text()]);
    $$("#buy-now").text(languagesEngine[selectedLang][$$("#buy-now").text()]);
    $$("#start-reading").text(languagesEngine[selectedLang][$$("#start-reading").text()]);
  
}
runLang();


  var bookToPreview = window.localStorage.getItem("theBookToPreview");
  bookToPreview = JSON.parse(bookToPreview);

    var theBookSN = bookToPreview.bookSN;
    var previewThumbnail = bookToPreview.bookThumbnail;
    var previewTitle = bookToPreview.bookName;
    var previewDescription = bookToPreview.bookDescription;
    var previewDate = bookToPreview.releaseDate;
    var previewPrice = bookToPreview.priceTag;
    var bookCount = bookToPreview.bookCount;
    var wordsCount = bookToPreview.wordsCount;
    var verifyPurchase = bookToPreview.verifyPurchase;

    $$("#book-title-bar").text(previewTitle);

    $$("#book-thumbnail-preview").css({
      "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + previewThumbnail + ")"
    });
    $$("#book-preview-title").text(previewTitle);
    $$("#book-preview-description").text(previewDescription);
    $$("#release-date-icon").text(previewDate);
    $$("#preview-price-tag").text(previewPrice);
    $$("#book-buy-count").text(bookCount);
    $$("#book-words-count").text(wordsCount);

    if (verifyPurchase == "Yes") {
      $$("#buy-button").hide();
      $$("#read-button").show();
    }else{
      $$("#buy-button").show();
      $$("#read-button").hide();
    }


    $$("#read-button").on("click", function(){
        readThisBook2(theBookSN);
    });


    $$("#buy-button").on("click", function(){
        app.dialog.preloader("Initiating Transaction...");

        var userDetails = window.localStorage.getItem("permanentReg");
        userDetails = JSON.parse(userDetails);
        var user_serial = userDetails.user_serial;





            app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/init_transaction.php', 
                { 
                  "tnx_buyer" : user_serial,
                  "item_id" : theBookSN

                }, function (data) {

                     console.log(data);
                     var data = data.split(" ");
                     if (data[1] == "Successful") {

                      var buyerMail = userDetails.email;
                      var amount = previewPrice;

                      //Code to determine if payment is in usd or naira
                      var splitAmount = amount.split(" ");
                      var currencyType = splitAmount[0];
                      var theCurrencyISO = "";
                        if(currencyType == "$"){
                          theCurrencyISO = "USD";
                        }
                        else{
                          theCurrencyISO = "NGN"
                        }
                      var realAmount = splitAmount[1];
                      var ref = data[0];

                        var deviceType = app.theme;
                        if (deviceType === "ios") {

                          // Initiate Payment using page Payment(Apple iOS)

                          //store parameters needed on the iOS page
                          var iosPayParams = {
                            "amount_to_pay" : realAmount,
                            "reference_no" : ref,
                            "the_currency" : theCurrencyISO
                          }
                          iosPayParams = JSON.stringify(iosPayParams);
                          window.localStorage.setItem("iosPayParams", iosPayParams);

                          mainView.router.navigate("/iospay/");
                          app.dialog.close();

                        }
                        else{

                          // Initiate Payment using inApp Browser(Google Android)
                          callToPaystack(buyerMail, realAmount, ref, theCurrencyISO);
                          
                        }

                          
                     }
                     else{

                        app.dialog.close();
                        app.dialog.alert(data);

                     }

              }, function(){

                    app.dialog.close();
                    app.dialog.alert("Transaction Failed! Network Error");

              });

    });






    //Call to Paystack API
  function callToPaystack(buyerMail, amount, ref, currency){
    app.request.post("https://ourdailymanna.org/xandercage/brexit/odmorg/paystack_init.php",
          {
            "buyer_email" : buyerMail,
            "amount_2_pay" : amount * 100,
            "tnx_reference" : ref,
            "currency" : currency
          },
           function(data){
            console.log(data);
            var parsedData = JSON.parse(data);
            console.log(parsedData);  

            var authUrl = parsedData.data.authorization_url;
            app.dialog.close();
            fireUpPayments(authUrl);
            

           }, function(){

              app.dialog.close();
              app.dialog.alert("Call to Paystack Failed!");
           });
  }


});












$$(document).on('page:init', '.page[data-name="iospay"]', function (e){

      var permanentReg = window.localStorage.getItem("permanentReg");
      permanentReg = JSON.parse(permanentReg);

      var iosPayParams = window.localStorage.getItem("iosPayParams");
      iosPayParams = JSON.parse(iosPayParams);

      var userEmail = permanentReg.email;


    
      PaystackPop.setup({
       key: 'pk_live_c87d75d7e484238c73106cc17a904d604d5a941c',
       email: userEmail,
       amount: iosPayParams.amount_to_pay * 100,
       reference : iosPayParams.reference_no,
       currency : iosPayParams.the_currency,
       subaccount : "ACCT_euk0zdfs06byt02",
       container: 'paystackEmbedContainer',
       callback: function(response){
            var returnedRef = response.reference;
            verifyMyTnx(returnedRef);
        },
      });




      function verifyMyTnx(myRef){

      app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/paystack_verify_tnx.php', 
                { 
                  "reference" : myRef

                }, function (data) {

                    if (data === "Transaction was successful") {


                  app.request.post("https://ourdailymanna.org/xandercage/brexit/odmorg/paystack_confirm_pay.php", 
                      {
                        "reference" : myRef

                      }, function(data){

                          mainView.router.navigate("/mypurchases/");                  
                        
                      },function(){

                        app.dialog.alert("Network Error. Try Again");
                        mainView.router.navigate("/preview/");

                      });
                      
                    }
                    else{

                      mainView.router.navigate("/preview/");
                    }

              }, function(){
                    app.dialog.alert("Network Error. Try Again");
                    mainView.router.navigate("/preview/");
              });
    

        }
    

    
});







$$(document).on('page:init', '.page[data-name="playaudio"]', function (e){


  var audioPlay = window.localStorage.getItem("audioProperties");
  audioPlay = JSON.parse(audioPlay);

    var audioSN = audioPlay.bookSN;
    var audioThumbnail = audioPlay.audioThumbnail;
    var audioTitle = audioPlay.audioName;
    var audioDescription = audioPlay.audioDescription;
    var audioUrl = audioPlay.audioUrl;
    var releaseDate = audioPlay.releaseDate;
    var audioLength = audioPlay.audioLength;

    $$("#audio-thumbnail-preview").css({
      "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + audioThumbnail + ")"
    });
    $$("#audio-source").prop("src", "https://ourdailymanna.org/xandercage/brexit/odmorg/audios/" + audioUrl);
    $$("#audio-title").text(audioTitle);
    $$("#audio-description").text(audioDescription);
    $$("#release-date-icon").text(releaseDate);
    $$("#audio-length").text(audioLength);
    $$("#audio-bar-title").text(audioTitle);

    

});





$$(document).on('page:init', '.page[data-name="playvideo"]', function (e){


  var videoPlay = window.localStorage.getItem("videoProperties");
  videoPlay = JSON.parse(videoPlay);

    var videoSN = videoPlay.bookSN;
    var videoTitle = videoPlay.videoName;
    var videoDescription = videoPlay.videoDescription;
    var videoUrl = videoPlay.videoUrl;
    var releaseDate = videoPlay.releaseDate;
    var videoLength = videoPlay.videoLength;

    
    $$("#video-source").prop("src", "https://ourdailymanna.org/xandercage/brexit/odmorg/videos/" + videoUrl);
    $$("#video-title").text(videoTitle);
    $$("#video-description").text(videoDescription);
    $$("#release-date-icon").text(releaseDate);
    $$("#video-length").text(videoLength);
    $$("#video-bar-title").text(videoTitle);

    

});








$$(document).on('page:init', '.page[data-name="playhealth"]', function (e){


  var healthPlay = window.localStorage.getItem("healthProperties");
  healthPlay = JSON.parse(healthPlay);


    var healthSN = healthPlay.healthSN;
    var healthTopic = healthPlay.healthTopic;
    var healthContent = healthPlay.healthContent;
    var healthImage = healthPlay.healthImage;
    var releaseDate = healthPlay.releaseDate;

    
    
    $$("#health-thumbnail-preview").css({
      "background-image" : "url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + healthImage + ")"
    });
    $$("#health-bar-title").text(healthTopic);
    $$("#health-tip-description").text(healthContent);
    $$("#release-date-icon").text(releaseDate);
    

    

});








$$(document).on('page:init', '.page[data-name="donations"]', function (e){



    function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

      
    $$("#donate-title").text(languagesEngine[selectedLang][$$("#donate-title").text()]);
    $$(".donate-to").text(languagesEngine[selectedLang][$$(".donate-to").text()]);
    $$("#sew").text(languagesEngine[selectedLang][$$("#sew").text()]);
    $$("#enter-amount").text(languagesEngine[selectedLang][$$("#enter-amount").text()]);
}

runLang();



    
    var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);
    var userSerial = permanentReg.user_serial;
    var userEmail = permanentReg.email;



    
    $$("#donations-btn").on("click", function(){

      app.dialog.preloader("Initiating Transaction...");
      var donationsBox = $$("#donations-box").val();

       if(donationsBox.trim() == "" || parseInt(donationsBox) < 10){
          app.dialog.close();
          app.dialog.alert("Donations starts from $10");
          return false;

        }
        else{

              
              app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/init_seed_transaction.php', 
                { 
                 
                  "tnx_buyer": userSerial,
                  "seed_amount": donationsBox,
                  

                }, function (data) {

                    console.log(data);
                     var data = data.split(" ");
                     if (data[1] == "Successful") {

                      var ref = data[0];

                          callToPaystack(userEmail, donationsBox, ref);
                     }
                     else{

                        app.dialog.close();
                        app.dialog.alert(data);

                     }

              }, function(){
                    app.dialog.close();
                    app.dialog.alert("Network Error!");
              });

        }
                
          });





       //Call to Paystack API
  function callToPaystack(buyerMail, amount, ref){
    app.request.post("https://ourdailymanna.org/xandercage/brexit/odmorg/paystack_init.php",
          {
            "buyer_email" : buyerMail,
            "amount_2_pay" : amount * 100,
            "tnx_reference" : ref,
            "currency" : "USD"
          },
           function(data){
            console.log(data);
            
            var parsedData = JSON.parse(data);
            console.log(parsedData);  

            var authUrl = parsedData.data.authorization_url;
            app.dialog.close();
            fireUpPayments(authUrl);
            

           }, function(){

              app.dialog.close();
              app.dialog.alert("Call to Paystack Failed!");
           });
  }



 

});








$$(document).on('page:init', '.page[data-name="mypurchases"]', function (e){


   

  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    var hip = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];

    for (var i = 0; i < hip.length; i++) {

      $$("." + hip[i]).text(languagesEngine[selectedLang][$$("." + hip[i]).text()]);
      
    }

  

    $$(".menu-home").text(languagesEngine[selectedLang][$$(".menu-home").text()]);
    $$(".menu-me").text(languagesEngine[selectedLang][$$(".menu-me").text()]);
    $$(".menu-books").text(languagesEngine[selectedLang][$$(".menu-books").text()]);    
    $$("#purchase-lib-text").text(languagesEngine[selectedLang][$$("#purchase-lib-text").text()]);
    $$("#latest-purchase-text").text(languagesEngine[selectedLang][$$("#latest-purchase-text").text()]);
    $$("#all-purchases-text").text(languagesEngine[selectedLang][$$("#all-purchases-text").text()]);
    $$("#myp-title").text(languagesEngine[selectedLang][$$("#myp-title").text()]);
    $$("#myp-back").text(languagesEngine[selectedLang][$$("#myp-back").text()]);

    

  }

    runLang();

  var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);
    var userSerial = permanentReg.user_serial;
   


  setTimeout(function(){
      fetchMyBooks();
    }, 500);


    var cardBookDisplayJoin = "", cardDisplayJoin2 = "";

   function fetchMyBooks(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/my_purchases.php', 
        {
          "my_xserial_number" : userSerial
        },
        function (data) {

          if(data == "No Purchases!"){

              app.dialog.alert(data);
              mainView.router.navigate("/store/");
          }
            else{
           

           var data = JSON.parse(data);
           console.log(data);

           

           
           for (var i = 0; i <= 0; i++) {
            var bookSN = data[i].book_sn;
            var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay = "<div onclick=\"readThisBook(" + bookSN + ")\" style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div> <div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span></div>";
             cardBookDisplayJoin += cardDisplay;

           }

           $$("#latest-one-haman-book").html(cardBookDisplayJoin);
           

            for (var i = 0; i < data.length; i++) { 
              var bookSN = data[i].book_sn;
              var bookName = data[i].book_name;
             var bookThumbnail = data[i].book_thumbnail;
             var bookContent = data[i].book_content;
             var price = data[i].price_naira;
             var releaseDate = data[i].release_date;

             var cardDisplay2 = "<div onclick=\"readThisBook(" + bookSN + ")\" class='col-50'><div class='card demo-card-header-pic animated fadeInUp'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/" + bookThumbnail + ")' valign='top' class='card-header'></div><div class='card-content card-content-padding'><span class='text-color-gray'>" + bookName + "</span></div></div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#all-haman-series").html(cardDisplayJoin2);
        }
      }, function(){
            console.log("Unable to find request");
      });
    }

    
});






$$(document).on('page:init', '.page[data-name="requests"]', function (e){



  function runLang(){
    var selectedLang = window.localStorage.getItem("language_select");

    $$("#req-back").text(languagesEngine[selectedLang][$$("#req-back").text()]);
    $$("#prayer-req").text(languagesEngine[selectedLang][$$("#prayer-req").text()]);
    $$("#send-req").text(languagesEngine[selectedLang][$$("#send-req").text()]);
    $$("#pending").text(languagesEngine[selectedLang][$$("#pending").text()]);
    $$("#completed").text(languagesEngine[selectedLang][$$("#completed").text()]);
    $$("#new").text(languagesEngine[selectedLang][$$("#new").text()]);
  
}

runLang();


  var permanentReg = window.localStorage.getItem("permanentReg");
    permanentReg = JSON.parse(permanentReg);
    var userSerial = permanentReg.user_serial;
   


  setTimeout(function(){
      fetchMyPendingRequests();
    }, 2000);


    var cardBookDisplayJoin = "", cardDisplayJoin2 = "", cardDisplayJoin3 = "";

   function fetchMyPendingRequests(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/my_prayer_requests.php', 
        {
          "my_xserial_number" : userSerial,
          "request_status" : "pending"
        },
        function (data) {
           
          console.log(data);
           var data = JSON.parse(data);
           

          
           

            for (var i = 0; i < data.length; i++) { 
              var requestTopic = data[i].request_topic;
             var requestMessage = data[i].request_message;
             var requestDate = data[i].request_date;
           
             var cardDisplay2 = "<div class='card animated fadeInUp'><div class='card-header text-color-primary'>" + requestTopic + "</div><div class='card-content card-content-padding'>" +  requestMessage + "</div><div class='card-footer'>" + requestDate + "</div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#pending-requests-pane").html(cardDisplayJoin2);
           fetchMyCompletedRequests();
        
      }, function(){
            console.log("Unable to find request");
      });
    }








    function fetchMyCompletedRequests(){
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/my_prayer_requests.php', 
        {
          "my_xserial_number" : userSerial,
          "request_status" : "completed"
        },
        function (data) {
           
          console.log(data);
           var data = JSON.parse(data);
           
            for (var i = 0; i < data.length; i++) { 
              var requestTopic = data[i].request_topic;
             var requestMessage = data[i].request_message;
             var requestDate = data[i].request_date;
           
             var cardDisplay3 = "<div class='card animated fadeInUp'><div class='card-header text-color-primary'>" + requestTopic + "</div><div class='card-content card-content-padding'>" +  requestMessage + "</div><div class='card-footer'>" + requestDate + "</div></div>";
             cardDisplayJoin3 += cardDisplay3;

           }

           $$("#completed-requests-pane").html(cardDisplayJoin3);
          
        
      }, function(){
            console.log("Unable to find request");
      });
    }





    $$("#send-request-btn").on("click", function(){

        var reqTitle = $$("#request-title").val();
        var reqDetails = $$("#request-details").val();

        if(reqTitle.trim() == "" || reqDetails.trim() == ""){

            app.dialog.alert("Please complete the form");
            return false

        }

        else{
            app.dialog.preloader("Sending Request...");

            app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/init_prayer_request.php', 
        {
          "my_xserial_number" : userSerial,
          "requesting_user_topic" : reqTitle,
          "requesting_user_message" : reqDetails
        },
        function (data) {
           
           app.dialog.close();
          if (data == "request successful") {

            app.dialog.alert("Request Sent!");
            mainView.router.refreshPage();
          }
          else{

            app.dialog.alert(data);
          }
                    
        
      }, function(){
            console.log("Unable to find request");
      });


    }

    });





    
});











$$(document).on('page:init', '.page[data-name="testimonies"]', function (e){

  $$(".share-odm-btn").on("click", function(){
    shareODM();

  });

  var selectedLang = window.localStorage.getItem("language_select");

  function runLang(){
    

    $$("#testimony-title").text(languagesEngine[selectedLang][$$("#testimony-title").text()]);
    $$("#member-test").text(languagesEngine[selectedLang][$$("#member-test").text()]);
  
}

runLang();


   
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_testimonies.php',
       {
        "lang" : selectedLang
        }, 
        function (data) {
           
          console.log(data);
           var data = JSON.parse(data);
           var cardDisplayJoin2 = "";

            for (var i = 0; i < data.length; i++) { 
              var testimonyPerson = data[i].testimony_person;
             var testimonyContent = data[i].testimony_content;
             var testimonyDate = data[i].testimony_date;
           
             var cardDisplay2 = "<div class='card'><div class='card-content card-content-padding'>&ldquo;" + testimonyContent + "&rdquo;</div><div class='card-footer'>- " + testimonyPerson + ", " + testimonyDate + "</div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#all-testimonies").html(cardDisplayJoin2);
           
        
      }, function(){
            console.log("Unable to find request");
      });
   





  });






$$(document).on('page:init', '.page[data-name="history"]', function (e){

  $$(".share-odm-btn").on("click", function(){
    shareODM();

  });

var selectedLang = window.localStorage.getItem("language_select");

function runLang(){
    

    $$(".history-title").text(languagesEngine[selectedLang][$$(".history-title").text()]);
  
}

runLang();


   
       app.request.post('https://ourdailymanna.org/xandercage/brexit/odmorg/list_historical_facts.php',
        {
          "lang" : selectedLang
        },
        function (data) {
           
          console.log(data);
           var data = JSON.parse(data);
           var cardDisplayJoin2 = "";

            for (var i = 0; i < data.length; i++) { 
              var historyTopic = data[i].history_topic;
             var historyImage = data[i].history_image;
             var historyContent = data[i].history_content;
             var releaseDate = data[i].release_date;
           
             var cardDisplay2 = "<div class='card demo-card-header-pic'><div style='background-image:url(https://ourdailymanna.org/xandercage/brexit/odmorg/imgs/history/" + historyImage + "')' valign='bottom' class='card-header'>" + historyTopic + "</div><div class='card-content card-content-padding'><p class='date'>Posted on " + releaseDate + "</p><p>" + historyContent + "</p></div></div>";
             cardDisplayJoin2 += cardDisplay2;

           }

           $$("#all-history").html(cardDisplayJoin2);
           
        
      }, function(){
            console.log("Unable to find request");
      });
   





  });







