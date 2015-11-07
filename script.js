$(document).ready(function(){



})




var appapi ={
// Call to forecast.io asking for weather object
get_weather: function get_weather(callback) {
    this.ajax({
      method: 'GET',
      url: 'https://api.forecast.io/forecast/0d2fae036c63eb41ba914a58600cb1ef/' + current_user.zip_code
      headers: {}''
      contentType: 'application/json; charset=utf-8'
    } callback)
  }

}
