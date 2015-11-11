$(document).ready(function(){

$('#logout').hide();
$("#profile_buttons_display").hide();
$('#profile_buttons').hide();
$('#profile').hide();
$('#profile_update').hide();
$('#profile_submit').hide();
$('#pairs').hide();
$('#pairings-table').hide();

///////////////////////////////////////////////////////////////////////////
//   LOGIN/REGISTER HELPER FUNCTIONS
var form2object = function(form) {
    var data = {};
    $(form).find('input').each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };

  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  var callback = function callback(error, data) {
    if (error) {
      console.error(error);
      return;
    }
    console.log(data);
  };


///////////////////////////////////////////////////////////////////////////
// Register and Login/Logout Click Handlers


// REGISTER
  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    weather_api.register(credentials, callback);
    e.preventDefault();
    $('#register_form').hide();
  });

//  LOGIN
  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    weather_api.login(credentials, function(err, data){
      if(err){
        console.log(err)
      }else{
        token = data.user.token;
        user_id = data.user.id;
        console.log(data);
        $('.modal-dialog').hide();
        $('#register_form').hide();
        $('#logout').show();
        $("#profile_buttons_display").show();
      }
    });
    e.preventDefault();

  });

// LOGOUT
  $('#logout').on('click', function(e) {
    weather_api.logout(user_id, token, function(err, data){
      if(err){
        console.log(err)
      }else{
        console.log("logged out");
      }
    });
    e.preventDefault();
    $('#logout').hide();
    $("#profile_buttons_display").hide();
    $('.modal-dialog').show();
  });


///////////////////////////////////////////////////////////////////////////
// Register and Login/Logout Click Handlers

//PROFILE NAVIGATION BUTTONS
$('#profile_buttons_display').on('click', function(){
  if($("#profile").is(":visible")){
    $('#profile').hide();
  } else{
    $('#profile_buttons').show();
    $('#profile_buttons_display').hide();
  }
});

// PROFILE CREATE DISPLAY
$('#profile_create').on("click", function(){
  $('#profile_buttons').hide();
  $('#profile').show();
  $('#profile_buttons_display').show();
  $('#profile_submit').show();


});

// PROFILE UPDATE DISPLAY
$('#profile_edit').on("click", function(){
  weather_api.readProfile(user_id, token, function(err, data){
    if(err){
      console.log(err)
    }else{
      $('#profile_buttons').hide();
      $('#profile').show();
      $('#profile_update').show();
      $('#nickname').val(data.profiles[0]['nickname']);
      $('#zip_code').val(data.profiles[0]['zip_code']);
      console.log(data);
    }
  })
})


// PROFILE UPDATE SUBMIT
  $('#profile_update').on('click',function(){
    var profile = wrap('profile', {
      "nickname": $("#nickname").val(),
      "zip_code": $("#zip_code").val()
    });
    weather_api.updateProfile(profile, user_id, token, function(err, data){
      if(err){
        console.log(err)
      }else{
        profile_id = data.profile.id;
        console.log(data);
      }
    })
    $('#profile').hide();
    $('#profile_buttons_display').show();
    $('#pairings').show();
    $('#pairings-table').show();
    // POPULATES TABLE
    weather_api.showPairs(token, function(err, data){
      if(err){
        console.log(err)
      }else{
        console.log(data);
        $('#examples').remove();
        data['weather_pairs'].forEach(function(pair){
          $('#pairings-table tr:last').after('<tr><td>' + pair.weather +  '</td><td>' + pair.genre + '</td></tr>');
        })
      }
    })

  })


// PROFILE CREATION
  $('#profile').on('submit', function(e) {
    var profile = wrap('profile', {
      "nickname": $("#nickname").val(),
      "zip_code": $("#zip_code").val(),
      "fav_meme": $("#fav_meme").val(),
      "user_id":  user_id
    });
    weather_api.createProfile(profile, user_id, token, function(err, data){
      if(err){
        console.log(err)
      }else{
        profile_id = data.profile.id;
        console.log(data);
      }
    });
    e.preventDefault();
    $('#profile').hide();
    $('#profile_buttons_display').show();
    $('#pairings').show();
    $('#pairings-table').show();
  });


// WEATHER PAIR CREATION
$('#pairs').on('submit', function(e) {
    var weather_pair = wrap('weather_pair', {
      "weather":    $("#weather").val(),
      "genre":      $("#genre").val(),
      "profile_id": profile_id
    });
    weather_api.createWeatherPair(weather_pair, token, function(err, data){
      if(err){
        console.log(err)
      }else{
        console.log(data);
      }
    });
    e.preventDefault();
    $('#examples').remove();
    $('#pairings-table tr:last').after(
      '<tr><td>' + $('#weather').val() +  '</td><td>' + $('#genre').val() + '</td></tr>');
  });
})

