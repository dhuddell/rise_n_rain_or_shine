'use strict';
var weather_api = {
  //url: 'https://blooming-sands-2451.herokuapp.com',
  url: 'http://localhost:3000',

  ajax: function(config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

//////////////////////////////////////////////////////////////////////////////////////////

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/register',
      contentType: 'application/json',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/login',
      contentType: 'application/json',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  logout: function logout(id, token, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/logout/' + user_id,
      headers: {
          Authorization: 'Token token=' + token
      },
      contentType: 'application/json',
      dataType: 'json'
    }, callback);
  },

//////////////////////////////////////////////////////////////////////////////////////////

createProfile: function createProfile(profile, user_id, token, callback) {
  this.ajax({
    method: 'POST',
    url: this.url + '/users/' + user_id + '/profile',
    headers: {
        Authorization: 'Token token=' + token
    },
    contentType: 'application/json',
    data: JSON.stringify(profile),
    dataType: 'json'
  }, callback);
},

updateProfile: function updateProfile(profile, user_id, token, callback) {
  this.ajax({
    method: 'PATCH',
    url: this.url + '/users/' + user_id + '/profile',
    headers: {
        Authorization: 'Token token=' + token
    },
    contentType: 'application/json',
    data: JSON.stringify(profile),
    dataType: 'json'
  }, callback);
},

readProfile: function readProfile(user_id, token, callback) {
  this.ajax({
    method: 'GET',
    url: this.url + '/users/' + user_id + '/profile',
    headers: {
      Authorization: 'Token token=' + token
    },
    dataType: 'json'

  }, callback);
},

destroyProfile: function destroyProfile(user_id, token, callback) {
  this.ajax({
    method: 'DELETE',
    url: this.url + '/users/' + user_id + '/profile',
    headers: {
      Authorization: 'Token token=' + token
    },
    dataType: 'json'

  }, callback);
},

showPairs: function showPairs(token, callback) {
  this.ajax({
    method: 'GET',
    url: this.url +  '/profile/weather_pairs',
    headers: {
      Authorization: 'Token token=' + token
    },
    dataType: 'json'

  }, callback);
},


createWeatherPair: function createWeatherPair(weather_pair, token, callback){
  this.ajax({
    method: 'POST',
    url: this.url + '/profile' + '/weather_pairs',
    headers: {
        Authorization: 'Token token=' + token
    },
    contentType: 'application/json',
    data: JSON.stringify(weather_pair),    //NEED TO ADD PROFILE ID TO THIS
    dataType: 'json'
    }, callback)
},

get_lat_lng: function get_lat_lng(zip_code, callback) {
    this.ajax({
      method: 'GET',
      url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + zip_code
    }, callback);
},

// Call to forecast.io asking for weather object ***********    B R O K E N    **************

get_weather: function get_weather(latlng, callback) {
    this.ajax({
      method: 'GET',
      url: 'https://api.forecast.io/forecast/0d2fae036c63eb41ba914a58600cb1ef/' + latlng,
      contentType: 'application/json'
    }, callback);
  },
};
