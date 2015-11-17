$(document).ready(function(){

  // LANDING PAGE DISPLAY
    $('#logout').hide();

    $("#profile_buttons_display").hide();
    $('#profile_buttons').hide();
    $('#profile').hide();
    $('#profile_update').hide();
    $('#profile_submit').hide();

    $('#pairs').hide();
    $('#pairings-table').hide();

    $('#sc-widget').hide();
    $('.alarm-button').hide();
    $('#weather_display').hide();

String.prototype.capitalizeFirstLetter = function() {
    return this.replace(/\b./g, function(m){ return m.toUpperCase(); });
}
  ///////////////////////////////////////////////////////////////////////////
  // // LOGIN/REGISTER HELPER FUNCTIONS
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


    var handleError = function handleError(error, data) {
      if (error) {
        console.error(error);
        return;
      } else{
        console.log(data);
        return data;
      }
    };

  ///////////////////////////////////////////////////////////////////////////
  // // Register and Login/Logout Click Handlers

    // REGISTER
      $('#register').on('submit', function(e) {
        var credentials = wrap('credentials', form2object(this));
        weather_api.register(credentials, function(err, data){
          handleError(err, data);
          $('#register_form').hide();
          $('#login_form').css('margin', '0px auto');
          $('#spacer').addClass('col-xs-3');
          e.preventDefault();
        });
      });

    // LOGIN
      $('#login').on('submit', function(e) {
        var credentials = wrap('credentials', form2object(this));
        weather_api.login(credentials, function(err, data){
          handleError(err,data);
          token = data.user.token;
          user_id = data.user.id;
          console.log(data);
          $('.modal-dialog').hide();
          $('#spacer').removeClass('col-xs-3');
          $('#logout').show();
          $("#profile_buttons_display").show();
        });
        e.preventDefault();

      });

    // LOGOUT
      $('#logout').on('click', function(e) {
        weather_api.logout(user_id, token, function(err, data){
          handleError(err,data);
          console.log("logged out");
          e.preventDefault();
          $('#logout').hide();
          $("#profile_buttons_display").hide();
          $('.modal-dialog').show();
          $('#register_form').show();
          $('#profile_buttons').hide();
          $('#profile').hide();
        });
      });

  ///////////////////////////////////////////////////////////////////////////
  // // Register and Login/Logout Click Handlers

    // PROFILE NAVIGATION BUTTONS
      $('#profile_buttons_display').on('click', function(){
        if($("#profile").is(":visible")){
          $('#profile').hide();
        } else{
          $('#profile_buttons').show();
          $('#profile_buttons_display').hide();
        }
      });

    // PROFILE DISPLAY CREATION
      $('#profile_create').on("click", function(){
        $('#profile_buttons').hide();
        $('#profile').show();
        $('#profile_buttons_display').show();
        $('#profile_submit').show();
      });

    // PROFILE CREATION
      $('#profile').on('submit', function(e) {
        var profile = wrap('profile', {
          "nickname": $("#nickname").val(),
          "zip_code": $("#zip_code").val(),
          "fav_meme": $("#fav_meme").val(),
          "user_id":  user_id
        });
        weather_api.createProfile(profile, user_id, token, function(err, data){
          handleError(err,data);
          profile_id = data.profile.id;
          zip_code = data.profile.zip_code;
          console.log(data.profile.current_weather);
          console.log(data);
          $('.weather').val(data.profile.current_weather.replace(/-/g,' ').capitalizeFirstLetter());
        });
        e.preventDefault();
        $('#profile').hide();
        $('#profile_submit').hide();
        $('#profile_buttons_display').show();
        $('#pairs').show();
        $('#pairings-table').show();
        $('.alarm-button').show();
        $('#weather_display').show();
      });

  // PROFILE DESTROY
    $('#profile_destroy').on('click', function(){
      weather_api.destroyProfile(user_id, token, function(err, data){
        handleError(err,data);
        console.log('Deleted');
        $('#profile_buttons_display').show();
        $('#profile_buttons').hide();
        $('#pairs').hide();
        $('#pairings-table').hide();
        $('.alarm-button').hide();
        $('#weather_display').hide();
      })
    });

    // PROFILE DISPLAY UPDATE
      $('#profile_edit').on("click", function(){
        weather_api.readProfile(user_id, token, function(err, data){
          handleError(err,data);
          $('#profile_buttons').hide();
          $('#profile').show();
          $('#profile_update').show();
          $('#nickname').val(data.profiles[0]['nickname']);
          $('#zip_code').val(data.profiles[0]['zip_code']);
        });
      });

  // PROFILE UPDATE SUBMIT + ZIP>LATLNG + GET WEATHER
    $('#profile_update').on('click',function(){
      var profile = wrap('profile', {
        "nickname": $("#nickname").val(),
        "zip_code": $("#zip_code").val(),
      });
      weather_api.updateProfile(profile, user_id, token, function(err, data){
        handleError(err,data);
        profile_id = data.profile.id;
        console.log(data.profile.current_weather);
        $('.weather').val(data.profile.current_weather.replace(/-/g,' ').capitalizeFirstLetter());
        console.log(data);
      // NAVIGATION
        $('#profile').hide();
        $('#profile_buttons_display').show();
        $('#pairs').show();
        $('.alarm-button').show();
        $('#weather_display').show();
        $('#pairings-table').show();
      // POPULATES TABLE
        weather_api.showPairs(token, function(err, data){
          handleError(err,data);
          console.log(data);
          $('#examples').remove();
          data['weather_pairs'].forEach(function(pair){
            $('#pairings-table tr:last').after('<tr><td>' + pair.weather.capitalizeFirstLetter() +  '</td><td>' + pair.genre.replace(/_/g,' ').capitalizeFirstLetter() + '</td></tr>');
          });
        })
      });
    });

  // WEATHER PAIR CREATION
    $('#pairs').on('submit', function(e) {
        var weather_pair = wrap('weather_pair', {
          "weather":    $("#weather").val(),
          "genre":      $("#genre").val(),
          "profile_id": profile_id
        });
        weather_api.createWeatherPair(weather_pair, token, function(err, data){
          handleError(err,data);
        });
        e.preventDefault();
        $('#examples').remove();
        $('#pairings-table tr:last').after(
          '<tr><td>' + $('#weather').val().capitalizeFirstLetter() +  '</td><td>' + $('#genre').val().replace(/_/g,' ').capitalizeFirstLetter() + '</td></tr>');
    });
});


