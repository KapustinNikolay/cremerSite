var model = {
  list: ko.observableArray(),
  orders: ko.observableArray()
};

var qqq = true;

function modell(url) {
    this.image = 'img/item/' + url + '.png';
    this.getImageUrl = 'url(' + this.image + ') no-repeat';
    return {getImageUrl: this.getImageUrl}
}


function showCategory (data) {
    $.ajax (
        {
          url: 'showCategory',
          type: 'get',
          data: data,
          dataType: 'json',
          success: function(data) {
            var length = data.length;
            if (length > 0) {
              if (length > 7) {
                length = 8;
              } else {
                length = data.length;
              }
              qqq = true;
              model.list.removeAll();
            for (var i = 0; i < length; ++i) {
              var obj = data[i];
              var q = new modell(obj.img);
              obj.img = q.getImageUrl;
              for ( var p in obj) {
                obj[p] = ko.observable(obj[p]);
              }
              model.list.push(obj);
            }
            } else {
              qqq= false;
            }
          }
        }
    )
}

function startUp () {
  model.list.removeAll();
  $.ajax (
      {
        url: 'startUp',
        type: 'get',
        dataType: 'json',
        success: function(data) {
          if (data.length > 7) {
            var length = 8;
          } else {
            var length = data.length;
          }
          for(var i = 0; i < length; ++i) {
            var obj = data[i];
            var q = new modell(obj.img);
            obj.img = q.getImageUrl;
            for ( var p in obj) {
              obj[p] = ko.observable(obj[p]);
            }
            model.list.push(obj);
          }
          ko.applyBindings(model);
        }
      }
  );
}

var orderMass = [];
var orderJSON = '';

model.addOrder = function() {
  var order = this;
  var obj = {
    'vendor': order.vendor(),
    'name': order.name(),
    'price': order.price(),
    'img': order.img()
  };
  orderMass.push(obj);
  orderJSON = $.toJSON(orderMass);
  $.cookie('InternetShopOrder', orderJSON, {expires: 2});
  $('.count').text(orderMass.length);
};

$(document).ready(function qq() {
  orderMass = [];

  if ($.cookie('InternetShopOrder') && $.cookie('InternetShopOrder') != 'null') {
    var cookieOrder = $.cookie('InternetShopOrder');
    orderMass = $.secureEvalJSON(cookieOrder);
  }


  $('.count').text(orderMass.length);


  $.ajax(
      {
        url: 'getCount',
        type:'get',
        data: {
          'woman':'woman',
          'man':'man',
          'kids': 'kids'
        },
        dataType:'json',
        success: function(data) {
          $('#womenPriceNumber').text(data.woman + ' товаров');
          $('#menPriceNumber').text(data.man + ' товаров');
          $('#kidsPriceNumber').text(data.kids + ' товаров');
        }
      }
  );

  var skip = 0;

  startUp();

  $('#main-page').on('click', function() {
    location.reload();
  });

  $('#search').keypress(function(e){
    if(e.keyCode==13){

      var name = $(this).children('input').val();

      $.ajax (
          {
            url: 'find',
            type: 'get',
            data: {name: name},
            dataType: 'json',
            success: function(data) {
              if(data.success === 'no-data') {

                model.list.removeAll();

                $('.specialPrice .text div:first').text("НИЧЕГО");
                $('#redText').text('НЕ НАЙДЕНО');
                $('body').animate({
                  scrollTop: 180
                }, 'fast')
                $('.navigationPanel, .logoText').slideUp();
              } else {

                model.list.removeAll();

                var obj = data;
                var q = new modell(obj.img);
                obj.img = q.getImageUrl;
                for ( var p in obj) {
                  obj[p] = ko.observable(obj[p]);
                }
                model.list.push(obj)

                $('.specialPrice .text div:first').text(name);
                $('#redText').text('');
                $('body').animate({
                  scrollTop: 180
                }, 'fast')
                $('.navigationPanel, .logoText').slideUp();
              }
            }
          });
    }
  });

  $('.text').click(function() {
    $('.specialPrice .text div:first').text('специальные')
    $('#redText').text('предложения');
    $('.navigationPanel, .logoText').slideDown();
    $('.arrows').hide();
    startUp();
  });


  $("#manButton").on('click', function() {
    skip = 0;
    category = 'man';
    showCategory({
      'category':'man',
      'limit': 8,
      'skip' : 0
    });
    $('.specialPrice .text div:first').text('мужская');
    $('#redText').text('коллекция');
    $('body').animate({
      scrollTop: 180
    }, 'fast')
    $('.navigationPanel, .logoText').slideUp();
    $('.arrows').show();
  });

  $("#womanButton").on('click', function() {
    skip = 0;
    category = 'woman';
    showCategory({'category':'woman',
      'limit': 8,
      'skip' : 0});
    $('.specialPrice .text div:first').text('женская')
    $('#redText').text('коллекция');
    $('body').animate({
      scrollTop: 180
    }, 'fast')
    $('.navigationPanel, .logoText').slideUp();
    $('.arrows').show();
  });

  $("#kidButton").on('click', function() {
    skip = 0;
    category = 'kids';
    showCategory({'category':'kids',
      'limit': 8,
      'skip' : 0});
    $('.specialPrice .text div:first').text('детская')
    $('#redText').text('коллекция');
    $('body').animate({
      scrollTop: 180
    }, 'fast')
    $('.navigationPanel, .logoText').slideUp();
    $('.arrows').show();
  });

  $('#next').on('click', function() {
    if (qqq) {
    skip +=8;
    showCategory({
      'category': category,
      limit:8,
      skip:skip
    })}
  });

  $('#prev').on('click', function() {
    if (skip >= 8) {
      skip -= 8;
      showCategory({
        'category': category,
        limit:8,
        skip:skip
      })
    }
  });

  $('.send-order').on('click', function() {
    location.href='sendorder.html';
  });

});