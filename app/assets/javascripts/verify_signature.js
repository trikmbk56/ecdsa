$(document).on('page:change', function(){
  $('#vs-elliptic').ready(function(){
    $.ajax({
      url: '/api/get_elliptic_curve_params',
      type: 'GET',
      data: {
        ec_name: $('#vs-elliptic').val()
      },
      success: function(json) {
        $('#vs-p').val(json.p);
        $('#vs-a').val(json.a);
        $('#vs-b').val(json.b);
        $('#vs-g').val(json.g);
        $('#vs-n').val(json.n);
      }
    });
  });

  $('#vs-elliptic').change(function(){
    $.ajax({
      url: '/api/get_elliptic_curve_params',
      type: 'GET',
      data: {
        ec_name: $('#vs-elliptic').val()
      },
      success: function(json) {
        $('#vs-p').val(json.p);
        $('#vs-a').val(json.a);
        $('#vs-b').val(json.b);
        $('#vs-g').val(json.g);
        $('#vs-n').val(json.n);
      }
    });
  });

  $('#vs-btn-message-upload').click(function(){
    file = $('#vs-message').prop('files');
    if (!file[0])
      Lobibox.notify('error', {
        msg: 'Không có file!', 
        delay: 1500,
        position: 'top right'
      });
    else if (file[0].size/1024/1024 > 5)
      Lobibox.notify('error', {
        msg: 'File quá lớn. Hãy upload file nhỏ hơn 5Mb!', 
        delay: 1500,
        position: 'top right'
      });
    else {
      var reader = new FileReader();
      reader.readAsBinaryString(file[0]);
      reader.onload = function(base64) {
        $.ajax({
          url: '/api/vs_upload_message',
          type: 'POST',
          data: {
            message_base64: base64.target.result
          },
          success: function(text) {
            Lobibox.notify('success', {
              msg: text, 
              delay: 1500,
              position: 'top right'
            });
          }
        });
      };
    }
  });

  $('#vs-btn-signature-upload').click(function(){
    file = $('#vs-signature').prop('files');
    console.log(file);
    if (!file[0])
      Lobibox.notify('error', {
        msg: 'Không có file!', 
        delay: 1500,
        position: 'top right'
      });
    else if (file[0].type != 'application/x-x509-ca-cert')
      Lobibox.notify('error', {
        msg: 'Không đúng định dạng! (.pem hoặc .der)', 
        delay: 1500,
        position: 'top right'
      });
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
            Lobibox.notify('success', {
              msg: text, 
              delay: 1500,
              position: 'top right'
            });
          }
        });
      };
    }
  });

  $('#vs-btn-public-key-upload').click(function(){
    file = $('#vs-public-key').prop('files');
    if (!file[0])
      Lobibox.notify('error', {
        msg: 'Không có file!', 
        delay: 1500,
        position: 'top right'
      });
    else if (file[0].type != 'application/x-x509-ca-cert')
      Lobibox.notify('error', {
        msg: 'Không đúng định dạng! (.pem hoặc .der)', 
        delay: 1500,
        position: 'top right'
      });
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
          success: function(json) {
            Lobibox.notify(json.type, {
              msg: json.text, 
              delay: 1500,
              position: 'top right'
            });
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
      success: function(json) {
        Lobibox.notify(json.type, {
          msg: json.text, 
          delay: 1500,
          position: 'top right'
        });
      }
    });
  });

  $('#boolean1-btn').click(function(){
    $.ajax({
      url: '/api/vs_boolean1',
      type: 'GET',
      success: function(json) {
        if (json.error)
          Lobibox.notify('error', {
            msg: json.error, 
            delay: 1500,
            position: 'top right'
          });
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
      Lobibox.notify('warning', {
        msg: "Chưa thực hiện bước trước đó!", 
        delay: 1500,
        position: 'top right'
      });
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
      Lobibox.notify('warning', {
        msg: "Chưa thực hiện bước trước đó!", 
        delay: 1500,
        position: 'top right'
      });
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
      Lobibox.notify('warning', {
        msg: "Chưa thực hiện bước trước đó!", 
        delay: 1500,
        position: 'top right'
      });
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
      Lobibox.notify('warning', {
        msg: "Chưa thực hiện bước trước đó!", 
        delay: 1500,
        position: 'top right'
      });
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
      Lobibox.notify('warning', {
        msg: "Chưa thực hiện bước trước đó!", 
        delay: 1500,
        position: 'top right'
      });
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
      Lobibox.notify('warning', {
        msg: "Chưa thực hiện bước trước đó!", 
        delay: 1500,
        position: 'top right'
      });
    }
    else {
      $.ajax({
        url: '/api/vs_vsrify_signature',
        type: 'GET',
        success: function(json){
          Lobibox.notify(json.type, {
            msg: json.text, 
            delay: 1500,
            position: 'top right'
          });
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
