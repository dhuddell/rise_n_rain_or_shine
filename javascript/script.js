$(document).ready(function(){

//      FORM INTO OBJECT
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
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
    console.log(data);
    if(data.user.token){
      myToken = data.user.token;
    }

  };


  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    weather_api.register(credentials, callback);
    e.preventDefault();
  });


  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    weather_api.login(credentials, callback);
    e.preventDefault();
  });

})


