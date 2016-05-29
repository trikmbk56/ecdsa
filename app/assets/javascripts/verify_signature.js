$(document).on('page:change', function(){
  $('#vs-elliptic').ready(function(){
    console.log("load");
  });

  $('#vs-elliptic').change(function(){
    console.log("change");
  });

  $('#vs-btn-message-upload').click(function(){
    file = $('#vs-message').prop('files');
    if (!file[0])
      alert('Không có file!');
    else if (file[0].size/1024/1024 > 5)
      alert('File quá lớn. Hãy upload file nhỏ hơn 5Mb!');
    else {
      var reader = new FileReader();
      reader.readAsDataURL(file[0]);
      reader.onload = function(base64) {
        $.ajax({
          url: '/api/vs_upload_message',
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

  $('#vs-btn-signature-upload').click(function(){
    file = $('#vs-signature').prop('files');
    console.log(file);
    if (!file[0])
      alert('Không có file!');
    else if (file[0].type != 'application/x-x509-ca-cert')
      alert('Không đúng định dạng! (.pem hoặc .der)');
    else {
      var reader = new FileReader();
      reader.readAsText(file[0]);
      reader.onload = function(text) {
        $.ajax({
          url: '/api/vs_upload_signature',
          type: 'POST',
          data: {
            signature: text.target.result
          },
          success: function(text) {
            alert(text);
          }
        });
      };
    }
  });

  $('#vs-btn-public-key-upload').click(function(){
    file = $('#vs-public-key').prop('files');
    if (!file[0])
      alert('Không có file!');
    else if (file[0].type != 'application/x-x509-ca-cert')
      alert('Không đúng định dạng! (.pem hoặc .der)');
    else {
      var reader = new FileReader();
      reader.readAsText(file[0]);
      reader.onload = function(text) {
        $.ajax({
          url: '/api/vs_upload_public_key',
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

  $('#vs-check-input').click(function(){
    $.ajax({
      url: '/api/vs_check_input',
      type: 'GET',
      data: {
        ec_name: $('#vs-elliptic').val()
      },
      success: function(text) {
        alert(text);
      }
    });
  });

  $('#boolean1-btn').click(function(){
    $.ajax({
      url: '/api/vs_boolean1',
      type: 'GET',
      success: function(json) {
        if (json.error)
          alert(json.error);
        else {
          $('#boolean1-input').val(json.result);
          $('#vs-r-input').val(json.r);
          $('#vs-s-input').val(json.s);
          $('#vs-r-output').val(json.r);
        }
      }
    });
  });
  $('#vs-compute-e').click(function(){
    $.ajax({
      url: '/api/vs_hash_message',
      type: 'GET',
      data: {
        hash: $('#vs-hash-function').val(),
      },
      success: function(text) {
        $('#vs-e-input').val(text);
      }
    });
  });

  $('#compute-w').click(function(){
    if ($('vs-s-input') == "") {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/vs_compute_w',
        type: 'GET',
        success: function(text) {
          $('#w-input').val(text);
        }
      })
    }
  });

  $('#compute-u1').click(function(){
    if ($('w-input') == "") {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/vs_compute_u1',
        type: 'GET',
        success: function(text) {
          $('#u1-input').val(text);
        }
      })
    }
  });

  $('#compute-u2').click(function(){
    if ($('w-input') == "") {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/vs_compute_u2',
        type: 'GET',
        success: function(text) {
          $('#u2-input').val(text);
        }
      })
    }
  });

  $('#compute-x').click(function(){
    if ($('u1-input') == '' || $('#u2-input') == '') {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/vs_compute_x',
        type: 'GET',
        success: function(json) {
          $('#x-input').val("04" + json.xx + json.yx);
          $('#xx-input').val(json.xx);
          $('#yx-input').val(json.yx);
        }
      })
    }
  });

  $('#compute-v').click(function(){
    if ($('#xx-input').val() == '') {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/vs_compute_v',
        type: 'GET',
        success: function(text) {
          $('#v-input').val(text);
          $('#vs-v-output').val(text);
        }
      });
    }
  });

  $('#vs-verify-signature').click(function(){
    if ($('#vs-r-output').val() == "" || $('#vs-v-output').val() == "") {
      alert("Chưa thực hiện bước trước đó!");
    }
    else {
      $.ajax({
        url: '/api/vs_vsrify_signature',
        type: 'GET',
        success: function(text){
          if (text == 'true') {
            $('#success-mess').show();
            $('#danger-mess').hide();
          }
          else {
            $('#success-mess').hide();
            $('#danger-mess').show();
          }
        }
      });
    }
  });

  $('.close-alert').click(function(){
    if ($(this).parent().attr('id') == 'success-mess') {
      $('#success-mess').hide();
    }
    if ($(this).parent().attr('id') == 'danger-mess') {
      $('#danger-mess').hide();
    }
  });
});
