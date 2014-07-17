var model = {
  priceList: ko.observableArray(),
  orderList: ko.observableArray()
};

$(document).ready(function() {
  ko.applyBindings(model);
  $('.view-button').on('click', function() {
    if ($(this).parent().find('.work-place').is(':hidden')) {
    $(this).parent().find('.work-place').slideDown();
    } else {
      $(this).parent().find('.work-place').slideUp();
    }
  });

  $('#data-send-button').on('click', function() {
    sendData($('#main-form').serialize());
  });

  $('#search-button').on('click', function() {
    findPrice($('#search-form').serialize());
    $('#search-form')[0].reset();
    $(document).find('.work-place').slideUp();
  });

  $('#show-all-button').on('click', function() {
    showAll();
  });

  $('#show-all-orders').on('click', function() {
    getOrders();
  });

  $('#show-completed-orders').on('click', function() {
    getAcceptedOrders();
  });
});

function getOrders() {
  model.priceList.removeAll();
  model.orderList.removeAll();
  $.ajax (
      {
        url: 'getOrders',
        type: 'get',
        dataType: 'json',
        success: function(data) {
          for (var i = 0; i < data.length; ++i) {

            var obj = data[i];

            if(!obj.accepted) {
              for (var q in obj) {
                obj[q] = ko.observable(obj[q])
              }
              obj.accepted =  ko.observable(false);
              model.orderList.push(obj);
            }
          }
        }
      }
  )
}

function getAcceptedOrders() {
  model.priceList.removeAll();
  model.orderList.removeAll();
  $.ajax (
      {
        url: 'getOrders',
        type: 'get',
        dataType: 'json',
        success: function(data) {
          for (var i = 0; i < data.length; ++i) {

            var obj = data[i];

            if(obj.accepted) {
              for (var q in obj) {
                obj[q] = ko.observable(obj[q])
              }

              model.orderList.push(obj);
            }
          }
        }
      }
  )
}

model.acceptOrder = function() {
  model.orderList.remove(this);
  var id = this._id();
  $.ajax (
      {
        url: 'acceptOrder',
        type: 'get',
        data: {id: id},
        dataType: 'json',
        success: function(data) {
          console.log(data);
        }
      }
  );
};

function sendData (data) {
  $.ajax (
      {
        url: 'getData',
        type: 'get',
        data: data,
        dataType: 'json',
        success: function(data) {
          if (data.result === 'success') {
            alert('WellDone');
            $('#main-form')[0].reset();
          } else {
          if (data.result === 'fail') {
            alert('Данные некорректны');
          }
        }
        }
      }
  );
}

function findPrice(data) {
  var search = data;
  $.ajax (
      {
        url: 'findPrice',
        type: 'get',
        data: data,
        dataType: 'json',
        success: function(data) {
          if(data.data === null) {
            alert('Не найдено')
          } else {
            console.log(data);
            model.orderList.removeAll();
            model.priceList.removeAll();
            if (data instanceof Array) {
              var length = data.length;
              for (var i = 0; i < length; ++i) {
                var obj = data[i];

                for (var b in obj) {
                  obj[b] = ko.observable(obj[b]);
                }

                model.priceList.push(obj);

              }
              $('.save-change').on('click', function() {
                saveChange($(this).parent().parent().serialize());
                findPrice(search);
              });

              $('.delete-button').on('click', function() {
                deleteObj($(this).parent().next().serialize());
                findPrice(search);
              });

              $('.change-button').on('click', function() {
                if ($(this).parent().next().is(':hidden')) {
                  $(this).parent().next().slideDown();
                } else {
                  $(this).parent().next().slideUp();
                }
              })

            } else {
              var obj = data;
              for (var b in obj) {
                obj[b] = ko.observable(obj[b])
              }

              model.priceList.push(obj);

              $('.save-change').on('click', function() {
                saveChange($(this).parent().parent().serialize());
                findPrice(search);
              });

              $('.delete-button').on('click', function() {
                deleteObj($(this).parent().next().serialize());
                model.priceList.pop();
              });

              $('.change-button').on('click', function() {
                if ($(this).parent().next().is(':hidden')) {
                  $(this).parent().next().slideDown();
                } else {
                  $(this).parent().next().slideUp();
                }

              })
            }
          }
        }
      }
  );
}

function showAll() {
  $.ajax (
      {
        url: 'showAll',
        type: 'get',
        dataType: 'json',
        success: function(data) {
          console.log(data);
          model.orderList.removeAll();
          model.priceList.removeAll();
          var length = data.length;
          for (var i = 0; i < length; ++i) {
            var obj = data[i];

            for (var b in obj) {
              obj[b] = ko.observable(obj[b]);
            }

            model.priceList.push(obj);

          }

          $('.save-change').on('click', function() {
            saveChange($(this).parent().parent().serialize());
            showAll();
          });

          $('.change-button').on('click', function() {
            if ($(this).parent().next().is(':hidden')) {
            $(this).parent().next().slideDown();
            } else {
              $(this).parent().next().slideUp();
            }
          });

          $('.delete-button').on('click', function() {
            deleteObj($(this).parent().next().serialize());
            showAll();
          })
        }
      }
  );
}

function deleteObj(data) {
  $.ajax (
      {
        url: 'deleteObj',
        type: 'get',
        data: data,
        dataType: 'json'
      })
}

function saveChange(data) {
  $.ajax (
      {
        url: 'saveChange',
        type: 'get',
        data: data,
        dataType: 'json',
        success: function(data) {
          if (data.result === 'success') {
            alert('WellDone');
          } else {
            if (data.result === 'fail') {
              alert('Данные некорректны');
            }
          }
        }
      })
}