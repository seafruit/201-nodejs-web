const async = require('async');

const constant = require('../config/constant');
const Item = require('../model/item');

export default class ItemController {
  getAll(req, res, next) {
    async.series({
      items: (done)=> {
        Item.find({})
          .populate('category')
          .exec(done)
      },
      totalCount: (done)=> {
        Item.count(done);
      }
    }, (err, result)=> {
      if (err) {
        return next(err);
      }
      if (!result) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.OK).send(result);
    })
  }

  getOne(req, res, next) {
    const itemId = req.params.itemId;
    Item.findById(itemId)
      .populate('category')
      .exec((err, doc)=> {
        if (err) {
          return next(err);
        }
        if (!doc) {
          return res.sendStatus(constant.httpCode.NOT_FOUND);
        }
        return res.status(constant.httpCode.OK).send(doc);
      })
  }

  delete(req, res, next) {
    const itemId = req.params.itemId;
    Item.findByIdAndRemove(itemId, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.NO_CONTENT);
    })
  }

  create(req, res, next) {
    Item.create(req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send({uri:`items/${doc._id}`});
    })
  }

  update(req, res, next) {
    const itemId = req.params.itemId;
    Item.findByIdAndUpdate(itemId, req.body, (err, doc)=> {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.NO_CONTENT);
    })
  }
}

module.exports = ItemController;
