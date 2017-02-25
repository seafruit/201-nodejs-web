const async = require('async');

const constant = require('../config/constant');
const Cart = require('../model/cart');

const mapItemToUri = (items)=> {
  return items.map((item, count)=> {
    return {uri: `items/${item}`, count}
  })
};

class CartController {
  getAll(req, res, next) {
    async.series({
      items: (done)=> {
        Cart.find({}, (err, docs)=> {
          if (err) {
            return done(err);
          }

          const carts = docs.map((doc)=> {
            const cart = doc.toJSON();
            cart.items = mapItemToUri(cart.items);
            return cart;
          });
          done(null, carts);
        })
      },
      totalCount: (done)=> {
        Cart.count(done);
      }
    }, (err, result)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.OK).send(result);
    });
  }

  getOne(req, res, next) {
    const cartId = req.params.cartId;
    Cart.findById(cartId, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }

      const data = doc.toJSON();
      data.items = mapItemToUri(data.items);
      return res.status(constant.httpCode.OK).send(data);
    })
  }

  delete(req, res, next) {
    const cartId = req.params.cartId;
    Cart.findByIdAndRemove(cartId, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }

  create(req, res, next) {
    Cart.create(req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send({uri: `carts/${doc._id}`});
    });
  }

  update(req, res, next) {
    const cartId = req.params.cartId;
    Cart.findByIdAndUpdate(cartId, req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    });
  }
}

module.exports = CartController;