const {Router} = require('express');
const CartController = require('../../controller/cart-controller');


const router = Router();
const cartCtrl = new CartController();

router.get('/', cartCtrl.getAll);
router.get('/:itemId',cartCtrl.getOne);
router.delete('/:itemId',cartCtrl.delete);
router.post('/',cartCtrl.create);
router.put('/:itemId',cartCtrl.update);

mudule.exports = router;