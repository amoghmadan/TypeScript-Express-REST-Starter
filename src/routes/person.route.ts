import { Router } from 'express';
import {
    fetchAll,
    fetchOne,
    createOne,
    fetchOneAndUpdate,
    fetchOneAndDelete
} from '../controllers/person.controller';

const router: Router = Router();

router.route('/').get(fetchAll).post(createOne);
router.route('/:id').get(fetchOne).put(fetchOneAndUpdate).delete(fetchOneAndDelete);

export default router;
