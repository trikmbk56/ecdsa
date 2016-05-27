$(document).on('page:change', function(){
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
      success: function(text) {
        alert(text);
      }
    })
  });

  $('#save-public-key').click(function(){
    $.ajax({
      url: '/api/save_public_key',
      type: 'GET',
      success: function(text) {
        alert(text);
      }
    })
  });
});
