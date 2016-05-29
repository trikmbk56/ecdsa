$(document).on('page:change', function(){
  $('#gs-btn-message-upload').click(function(){
    file = $('#gs-message').prop('files');
    if (!file[0])
      alert('Không có file!');
    else if (file[0].size/1024/1024 > 5)
      alert('File quá lớn. Hãy upload file nhỏ hơn 5Mb!');
    else {
      var reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = function(base64) {
        $.ajax({
          url: '/api/gs_upload_message',
          type: 'POST',
          data: {
            message_base64: base64.target.result
          },
          success: function(text) {
            alert(text);
          }
        });
      };
    }
  });

  $('#gs-btn-private-key-upload').click(function(){
    file = $('#gs-private-key').prop('files');
    if (!file[0])
      alert('Không có file!');
    else if (file[0].type != 'application/x-x509-ca-cert')
      alert('Không đúng định dạng! (.pem hoặc .der)');
    else {
      var reader = new FileReader();
      reader.readAsText(file[0]);
      reader.onload = function(text) {
        $.ajax({
          url: '/api/gs_upload_private_key',
          type: 'POST',
          data: {
            key: text.target.result
          },
          success: function(text) {
            alert(text);
          }
        });
      };
    }
  });

  $('#gs-check-input').click(function(){
    $.ajax({
      url: '/api/gs_check_input',
      type: 'GET',
      data: {
        ec_name: $('#gs-elliptic').val()
      },
      success: function(text) {
        alert(text);
      }
    });
  });

  $('#select-k').click(function(){
    $.ajax({
      url: '/api/gs_select_k',
      type: 'GET',
      success: function(text) {
        if (text == 'Chưa check input!')
          alert(text);
        else
          $('#k-input').val(text);
      }
    })
  });

  $('#compute-kg').click(function(){
    if ($('#k-input').val() == '') {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/gs_compute_kg',
        type: 'GET',
        success: function(json) {
          $('#kg-input').val(json.kg);
          $('#x1-input').val(json.x1);
          $('#y1-input').val(json.y1);
        }
      });
    }
  });

  $('#compute-r').click(function(){
    if ($('#x1-input').val() == '') {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/gs_compute_r',
        type: 'GET',
        success: function(text) {
          $('#r-input').val(text);
          $('#r-input-signature').val(text);
        }
      });
    }
  });

  $('#compute-k-1').click(function(){
    if ($('#k-input').val() == '') {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/gs_compute_inverse_k',
        type: 'GET',
        success: function(text) {
          $('#k-1-input').val(text);
        }
      });
    }
  });

  $('#compute-e').click(function(){
    $.ajax({
      url: '/api/gs_hash_message',
      type: 'GET',
      data: {
        hash: $('#gs-hash-function').val(),
      },
      success: function(text) {
        $('#e-input').val(text);
      }
    });
  });

  $('#compute-s').click(function(){
    if ($('#k-1-input').val() == "" || $('#e-input').val() == "" || $('#r-input').val() == "")
      alert("Chưa thực hiện bước trước đó!");
    else {
      $.ajax ({
        url: '/api/gs_compute_s',
        type: 'GET',
        success: function(text) {
          $('#s-input').val(text);
          $('#s-input-signature').val(text);
        }
      });
    }
  });

  $('#gs-save-signature').click(function(){
    if ($('#r-input-signature').val() == '' || $('#s-input-signature').val() == '')
      alert("Chưa thực hiện đủ các bước của thuật toán!");
    else {
      $.ajax({
        url: '/api/save_signature',
        type: 'GET',
        success: function(text) {
          alert(text);
        }
      });
    }
  });
});
