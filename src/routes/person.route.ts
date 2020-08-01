import { Router } from 'express';
import { personalController } from '../controllers/person.controller';

const router: Router = Router();

router.route('/')
    .get(personalController.fetchAll)
    .post(personalController.createOne);
router.route('/:id')
    .get(personalController.fetchOne)
    .put(personalController.fetchOneAndUpdate)
    .delete(personalController.fetchOneAndDelete);

export default router;
