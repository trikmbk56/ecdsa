$(document).on('page:change', function(){
  $('#gk-elliptic').ready(function(){
    $.ajax({
      url: '/api/get_elliptic_curve_params',
      type: 'GET',
      data: {
        ec_name: $('#gk-elliptic').val()
      },
      success: function(json) {
        $('#gk-p').val(json.p);
        $('#gk-a').val(json.a);
        $('#gk-b').val(json.b);
        $('#gk-g').val(json.g);
        $('#gk-n').val(json.n);
      }
    });
  });

  $('#gk-elliptic').change(function(){
    $.ajax({
      url: '/api/get_elliptic_curve_params',
      type: 'GET',
      data: {
        ec_name: $('#gk-elliptic').val()
      },
      success: function(json) {
        $('#gk-p').val(json.p);
        $('#gk-a').val(json.a);
        $('#gk-b').val(json.b);
        $('#gk-g').val(json.g);
        $('#gk-n').val(json.n);
      }
    });
  });

  $('#select-d').click(function(){
    $.ajax({
      url: '/api/select_d',
      type: 'GET',
      data: {
        ec_name: $('#gk-elliptic').val()
      },
      success: function(text) {
        $('#d-input').val(text);
        $('#private-key').val(text);
      }
    });
  });

  $('#compute-q').click(function(){
    if ($('#d-input').val() == '')
      alert('Chưa thực hiện bước trước đấy');
    else {
      $.ajax({
      url: '/api/compute_q',
      type: 'GET',
      success: function(text) {
        $('#q-input').val(text);
        $('#public-key').val(text);
      }
    });
    }
  });

  $('#save-private-key').click(function(){
    $.ajax({
      url: '/api/save_private_key',
      type: 'GET',
      success: function(json) {
        if (json.status == "success") {
          document.location.href = '/api/download_key?filename=' +
            json.filename;
        }
        else {
          alert(json.text);
        }
      }
    })
  });

  $('#save-public-key').click(function(){
    $.ajax({
      url: '/api/save_public_key',
      type: 'GET',
      success: function(json) {
        if (json.status == "success") {
          document.location.href = '/api/download_key?filename=' +
            json.filename;
        }
        else {
          alert(json.text);
        }
      }
    })
  });
});
