model.deleteOrder = function() {
  model.orders.remove(this);

  orderMass = [];

  var data = model.orders();

  for (var i = 0; i < data.length; i++) {
    var obj = {
      'img': data[i].img(),
      'name': data[i].name(),
      'price': data[i].price(),
      'vendor': data[i].vendor()
    };
    orderMass.push(obj);
  }
  orderJSON = $.toJSON(orderMass);
  $.cookie('InternetShopOrder', orderJSON);
  $('.count').text(orderMass.length);

  getCommonCount();
};

function getCommonCount() {
  var sum = 0;
  for (var i = 0; i < orderMass.length; ++i) {
    sum+=orderMass[i].price;
  }
  $('.common-sum').text(sum);
}

$(document).ready(function() {

  for (var i = 0; i < orderMass.length; ++i) {
    var obj = orderMass[i];

    for (var q in obj) {
      obj[q] = ko.observable(obj[q]);
    }

    model.orders.push(obj);
  }

  $('.text').off();

  if ($.cookie('InternetShopOrder') != 'null') {
    var cookieOrder = $.cookie('InternetShopOrder');
    orderMass = $.secureEvalJSON(cookieOrder);
  }
  getCommonCount();

  $('.button').on('click', function() {
    var obj = $(this).parent().parent().serialize();
    var priceString = '';
    for (var i = 0; i < orderMass.length; ++i) {
      priceString += ', ' + orderMass[i].name;
    }

    obj += '&price=' + $('.common-sum:first').text() + '&count=' + orderMass.length + '&prices=' + priceString.replace(', ','') +'&date=' + new Date().toLocaleString();
    $.ajax({
      url: 'addOrder',
      type: 'get',
      data: obj,
      dataType: 'json',
      success: function(res) {
        if (res) {
          $.cookie('InternetShopOrder', null);
          $('.name-block-cart .text div:first').text('заказ');
          $('#redText').text('принят');
          $('.common-sum').text(0);
          $('.form-container').slideUp();
        }
      }
    })
  });
});
