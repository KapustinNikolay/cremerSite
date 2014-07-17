var path = require('path'),
    express = require('express'),
    db = require('./lib');

var app = express();


app.use('/', express.static(path.join(__dirname, '/public')));

app.get('/admin', function(req, res) {
  res.redirect('/admin.html');
});

app.get('/getData', function(req, res) {
  if (req.query.price != '' && req.query.name != '' && req.query.class != '' &&
      req.query.vendor != '' && req.query.img != '') {
    req.query.price = parseInt(req.query.price);
  db.insertToDb(req.query, function() {
    res.send({result:'success'});
  });
  } else {
    res.send({result:'fail'});
  }
});

app.get('/find', function(req, res) {
  db.find(req.query, function(err, data) {
    if (err) {
      res.send({success: 'fail'})
    } else {
      if (data) {
      res.send(data);
      } else {
        res.send({success:'no-data'})
      }
    }
  })
});

app.get('/findPrice', function(req, res) {
  if(req.query.name != '') {
    db.findOne(req.query, function(err, data) {
      if (data != null) {
      res.send(data);
      } else {
        res.send({data: null})
      }
    })
  } else {
    db.findVendor(req.query.vendor, function(err, data) {
      if (data != []) {
        console.log(data);
        res.send(data);
      } else {
        res.send({data: null})
      }
    })
  }
});

app.get('/showAll', function(req, res) {
  db.showAll(function(err, data) {
    res. send(data);
  })
});

app.get('/deleteObj', function(req, res) {
  db.deleteObj(req.query, function(err, data) {
    console.log(err, data);
  })
});

app.get('/saveChange', function(req, res) {
  if (req.query.price != '' && req.query.name != '' && req.query.class != '' &&
      req.query.vendor != '' && req.query.img != '') {
    req.query.price = parseInt(req.query.price);
    db.saveChange(req.query, function() {
      res.send({result:'success'});
    });
  } else {
    res.send({result:'fail'});
  }
});

app.get('/acceptOrder', function(req, res) {
    db.acceptOrder(req.query, function(err, data) {
      console.log(err, data);
      res.send({result:'success'});
    });
});

app.get('/startUp', function(req, res) {
  db.startUp(function(err, data) {
    res.send(data);
  })
});

app.get('/showCategory', function(req, res) {
  console.log(req.query);
  db.showCategory(req.query, function(err, data) {
    res.send(data);
  })
});

app.get('/getCount', function(req, res) {
  db.getCount(req.query, function(data) {
    res.send(data);
  })
});

app.get('/addOrder', function(req, res) {
  db.addOrder(req.query, function() {
    res.send({result:'success'});
  });
});

app.get('/getOrders', function(req, res) {
  db.getOrders(function(err, data) {
    res.send(data);
  });
});

app.listen(9000);