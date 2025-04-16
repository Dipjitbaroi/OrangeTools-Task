import express from 'express';
import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getUniqueTags,
} from '../controllers/customerController.js';
import { checkToken } from '../middlewares/checkToken.js';

const router = express.Router();

router.get('/all/', checkToken, getAllCustomers);
router.get('/:id', checkToken, getCustomerById);
router.post('/', checkToken, createCustomer);
router.put('/:id', checkToken, updateCustomer);
router.delete('/:id', checkToken, deleteCustomer);
router.get('/tags/unique', checkToken, getUniqueTags);

export default router;