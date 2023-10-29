const bodyParser = require('body-parser');
const jobsRouter = require('express').Router();
const jobsController = require('../controllers/jobs-controller');
const authMiddleware = require('../middlewares/auth-middleware');

jobsRouter.use(bodyParser.urlencoded({ extended: false }));
jobsRouter.use(bodyParser.json());

jobsRouter.use(authMiddleware).get('/jobs/executions', jobsController.getAllExecutions);
jobsRouter.use(authMiddleware).get('/jobs/executions/:jobId', jobsController.getAllExecutionsForJob);
jobsRouter.use(authMiddleware).get('/jobs', jobsController.getAllJobs);
jobsRouter.use(authMiddleware).get('/jobs/:id', jobsController.getJob);
jobsRouter.use(authMiddleware).post('/jobs', jobsController.createJob);
jobsRouter.use(authMiddleware).put('/jobs/:id', jobsController.updateJob);

module.exports = jobsRouter;