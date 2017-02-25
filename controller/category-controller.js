const async = require('async');

const constant = require('../config/constant');
const Category = require('../model/category');
const Item = require('../model/item');

class CategoryController{
  getAll(req,res,next){
    async.series({
      items:(done)=>{
        Category.find({},done);
      },
      totalCount:(done)=>{
        Category.count(done);
      }
    },(err,result)=>{
      if(err){
        return next(err);
      }
      if(!result){
        return res.sendSatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.OK).send(result);
    })
  }

  getOne(req,res,next){
    const categoryId = req.params.categoryId;
    Category.findById(categoryId,(err,doc)=>{
      if(err){
        return next(err);
      }
      if(!doc){
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.OK).send(doc);
    })
  }

  create(req,res,next){
    Category.create(req.body,(err,doc)=>{
      if(err){
        return next(err);
      }
      return res.status(constant.httpCode.CREATED).send({uri:`categories/${doc._id}`});
    })
  }

  update(req,res,next){
    const categoryId = req.params.categoryId;
    Category.findByIdAndUpdate(categoryId,req.body,(err,doc)=>{
      if(err){
        return next(err);
      }
      if(!doc){
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      return res.status(constant.httpCode.NO_CONTENT);
    })
  }
  delete(req,res,next){
    const categoryId = req.params.categoryId;

    async.waterfall([
      (done)=>{
        Item.findOne({},done);
      },(docs,done)=>{
        if(docs){
          return done(true,null);
        }else{
            Category.findByIdAndRemove(categoryId, (err, doc)=> {
              if(!doc){
                return done(false,null)
              }
              done(err,doc);
            })
        }
      }
    ],(err,result)=>{
      if(err === true){
        return res.sendStatus(constant.httpCode.BAD_REQUEST);
      }
      if(err === false){
        return res.sendStatus(constant.httpCode.NOT_FOUND);
      }
      if(err){
        return next(err);
      }
      return res.sendStatus(constant.httpCode.NO_CONTENT);
    })
  }

}

module.exports = CategoryController;

