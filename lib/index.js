var mongoClient = require('mongodb').MongoClient,
        Timestamp = require('mongodb').Timestamp,
          ObjectId = require('mongodb').ObjectID;

mongoClient.connect('mongodb://127.0.0.1:27017/site', function (err, conn) {
      if (err) {
        console.log(err);
        throw err;
      } else
        db = conn;
    }
);

exports.insertToDb = function(data, callback) {
  db.collection('price').insert(
      data,
      {safe:true},
      function(err) {
          callback(err);
      }
  )
};

exports.findOne = function(data, callback) {
  db.collection('price').findOne(
      {
        vendor: data.vendor,
        name: data.name
      }, function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      }
  )
};

exports.findVendor = function(data, callback) {
  db.collection('price').find(
      {
        vendor: data
      }
  ).toArray(function(err, data) {
        if(err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      })
};

exports.showAll = function(callback) {
  db.collection('price').find().toArray(function(err, data) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  })
};

exports.deleteObj = function(data, callback) {
  db.collection('price').remove(
      {
        name: data.name,
        vendor: data.vendor,
        category: data.category
      }, function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data);
        }
      }
  )
};

exports.acceptOrder = function(data, callback) {
  var id = new ObjectId(data.id);
  db.collection('orders').update(
      {
        '_id': id
      },
      {
        $set: {accepted: true}
      },
      function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data)
        }
      }
  )
};

exports.saveChange = function(data, callback) {
  var id = new ObjectId(data.id);
  db.collection('price').update(
      {
        '_id': id
      },
      {
        $set: data
      },
      function(err, data) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, data)
        }
      }
  )
};

exports.startUp = function(callback) {
  db.collection('price').find ().limit(8).toArray(function(err, data) {
    callback(err, data);
  })
};

exports.showCategory = function(data, callback) {
  db.collection('price').find(
      {
        category: data.category
      }).limit(parseInt(data.limit)).skip(parseInt(data.skip)).toArray(function(err, data) {
        callback(err, data);
      })
};

exports.find = function(data, callback) {
  db.collection('price').findOne(
      {
        name: data.name
      }, function(err, res) {
        callback(err, res);
      }
  );
};

exports.addOrder = function(data, callback) {
  db.collection('orders').insert(
      data,
      {safe:true},
      function(err) {
        callback(err);
      }
  )
};

exports.getOrders = function(callback) {
  db.collection('orders').find().toArray(function(err, data) {
    callback(err, data);
  });
};

exports.getCount = function(category, callback) {
  db.collection('price').find(
      {category:category.woman}
  ).toArray(function(err1, data1){
        db.collection('price').find(
            {category:category.man}
        ).toArray(function(err2, data2) {
              db.collection('price').find(
                  {category:category.kids}
              ).toArray(function(err3, data3) {
                    callback({
                      'woman':data1.length,
                      'man':data2.length,
                      'kids': data3.length
                    })
                  })
            })
      })
};