$(document).ready(function(){

  ///////////////////////////////////////////////////////////////////////////
  // // Display and String normalizer

    SHORT_WEATHER_LOOKUP = {
      'clear-night': 'clear',
      'clear-day': 'clear',
      'rain': 'raining',
      'snow': 'snowing',
      'sleet': 'raining',
      'wind': 'clear',
      'fog': 'cloudy',
      'cloudy': 'cloudy',
      'partly-cloudy-day': 'cloudy',
      'partly-cloudy-night': 'cloudy'
    };

     var widget = SC.Widget($('#sc-widget'));
     widget.bind(SC.Widget.Events.READY, function() {
       console.log('Player Ready...');
     });


    // // Landing Page Display
    //   $("#logout, #profile_buttons_display, #profile_buttons, #profile, #profile_update, #profile_submit").hide();

    //   $('#pairs, #pairings-table, #sc-widget, .alarm-button, #weather_display, #genre_display').hide();

    // Normalize strings
      String.prototype.capitalizeFirstLetter = function() {
          return this.replace(/\b./g, function(m){ return m.toUpperCase(); });
      }

  ///////////////////////////////////////////////////////////////////////////
  // // Login / Register Helper Functions
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


    var handleError = function handleError(error, data, optional_alert) {
      if (error) {
        console.error(error);
        if(optional_alert){
          optional_alert();
        }
        throw error;
      } else {
        console.log(data);
      }
    };

  ///////////////////////////////////////////////////////////////////////////
  // // Register and Login/Logout Click Handlers

    // Register
      $('#register').on('submit', function(e) {
        var credentials = wrap('credentials', form2object(this));
        weather_api.register(credentials, function(err, data){
          handleError(err, data, function(){
            alert("Invalid registration");
          });
          $('#register_form').hide();
          $('#login_form').css('margin', '0px auto');
          $('#spacer').addClass('col-xs-3');
        });
        e.preventDefault();
      });

    // Login
      $('#login').on('submit', function(e) {
        var credentials = wrap('credentials', form2object(this));
        weather_api.login(credentials, function(err, data){
          handleError(err,data, function(){
            alert("Invalid credentials");
          });
          token = data.user.token;
          user_id = data.user.id;
          $('.modal-dialog').hide();
          $('#spacer').removeClass('col-xs-3');
          $('#logout').show();
          $("#profile_buttons_display").show();
        });
        e.preventDefault();
      });

    // Logout
      $('#logout').on('click', function(e) {
        weather_api.logout(user_id, token, function(err, data){
          handleError(err,data);
          console.log("logged out");
          $('.modal-dialog').show();
          $('#register_form').show();
          $("#logout, #profile_buttons_display, #profile_buttons, #profile, #profile_update, #profile_submit").hide();
          $('#pairs, #pairings-table, #sc-widget, .alarm-button, #weather_display, #genre_display').hide();
        });
        e.preventDefault();
      });

  ///////////////////////////////////////////////////////////////////////////
  // // Profile Creation and Navigation Click Handlers

    // Profile Navigation Buttons
      $('#profile_buttons_display').on('click', function(){
        if($("#profile").is(":visible")){
          $('#profile').hide();
        } else{
          $('#profile_buttons').show();
          $('#profile_buttons_display').hide();
        }
      });

    // Profile Creation Form
      $('#profile_create').on("click", function(){
        $('#profile_buttons').hide();
        $('#profile').show();
        $('#profile_buttons_display').show();
        $('#profile_submit').show();
      });

    // Profile Creation
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
        $('.alarm-button').css("display", "inline-block");
        $('#weather_display, #genre_display').show();

      });

  ///////////////////////////////////////////////////////////////////////////
  // // Profile Destroy / Read / Update and Weather Pair Creation

    // Profile Destroy
      $('#profile_destroy').on('click', function(){
        weather_api.destroyProfile(user_id, token, function(err, data){
          handleError(err,data);
          console.log('Deleted');
          $('#profile_buttons_display').show();
          $('#profile_buttons').hide();
          $('#profile_update').hide();
          $('#pairs').hide();
          $('#pairings-table').hide();
          $('.alarm-button').hide();
          $('#weather_display, #genre_display').hide();
        })
      });

    // Profile Display Update
      $('#profile_edit').on("click", function(){
        weather_api.readProfile(user_id, token, function(err, data){
          handleError(err,data);
          $('#profile_buttons').hide();
          $('#profile').show();
          $('#profile_update').show();
          $('#nickname').val(data.profile.nickname);
          $('#zip_code').val(data.profile.zip_code);
        });
      });

    // Profile Update Submit + Zip->LatLng + Get Weather
      $('#profile_update').on('click',function(){
        var profile = wrap('profile', {
          "nickname": $("#nickname").val(),
          "zip_code": $("#zip_code").val(),
        });
        weather_api.updateProfile(profile, user_id, token, function(err, data){
          handleError(err,data, function(){
            alert("No Profile!");
          });
          profile_id = data.profile.id;
          current_weather = SHORT_WEATHER_LOOKUP[data.profile.current_weather];
          console.log(data.profile.current_weather);
          $('.weather').val(data.profile.current_weather.replace(/-/g,' ').capitalizeFirstLetter());
        // NAVIGATION
          $('#profile').hide();
          $('#profile_buttons_display').show();
          $('#pairs').show();
          $('.alarm-button').css("display", "inline-block");
          $('#weather_display, #genre_display').show();
          $('#pairings-table').show();
        // POPULATES TABLE
          weather_api.showPairs(token, function(err, data){
            handleError(err,data);
            current_genre = 'Default: Ambient';
            $('.genre').val(current_genre);

          // GETS GENRE FOR ALARM
            data['weather_pairs'].forEach(function(pair){
              if(pair.weather === current_weather){
                console.log(pair.genre);
                current_genre = pair.genre;
                $('.genre').val(pair.genre.replace(/_/g,' ').capitalizeFirstLetter());
              }
            });

            $('#examples').remove();
            $('#pairings-table td').remove();
            data['weather_pairs'].forEach(function(pair){
              $('#pairings-table tr:last').after('<tr><td>' + pair.weather.capitalizeFirstLetter() +  '</td><td>' + pair.genre.replace(/_/g,' ').capitalizeFirstLetter() + '</td></tr>');
            });
          });
        });
        weather_api.getTrack(token, function(err, data){
            handleError(err,data);
            user_track = data.track;
            widget.load(user_track);
        });
      });

    // Weather Pair Creation
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


