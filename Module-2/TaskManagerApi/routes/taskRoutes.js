const taskRoutes = require('express').Router();
const bodyParser = require('body-parser');

const taskValidator = require('../validators/taskValidator');

// In memory task store object for demo purpose.
const taskStore = require('../initial-data.json');

taskRoutes.use(bodyParser.urlencoded({extended: false}));
taskRoutes.use(bodyParser.json());

// GET /tasks: Retrieve all tasks.
taskRoutes.get('/', (req, res) => {
    try {
        console.log('----- GET /tasks: started -----');

        res.send(taskStore).status(200);

        console.log('----- GET /tasks: completed -----');
    } catch(ex) {
        console.log(ex);
        res.send('Internal server error').status(500);
        console.log('----- GET /tasks: failed -----');
    }
});

// GET /tasks/:id: Retrieve a single task by its ID.
taskRoutes.get('/:id', (req, res) => {
    try {
        console.log('----- GET /tasks/:id: started -----');

        const taskId = req.params.id;
        const result = taskStore.task.find(t => t.taskId === taskId);
        if(result === undefined) {
            res.send('Task Id (' + taskId +  ') not found').status(204);
        } else {
            res.send(result).status(200);
        }

        console.log('----- GET /tasks/:id: completed -----');
    } catch(ex) {
        console.log(ex);
        res.send('Internal server error').status(500);
        console.log('----- GET /tasks/:id: failed -----');
    }
});

// POST /tasks: Create a new task.
taskRoutes.post('/', (req, res) => {
    try {
        console.log('----- POST /tasks: started -----');

        const taskToAdd = req.body;
        const objValidation = taskValidator.validateNewTaskObject(taskToAdd, taskStore);

        if (taskToAdd && objValidation.isValid) {
            taskStore.task.push(taskToAdd);
            res.send(taskToAdd).status(200);
        } else {
            if (!objValidation.isValid) {
                if (!objValidation.isRequiredPropertiesValid) {
                    res.send('Invalid required properties for task object.').status(400);
                } else if (!objValidation.isTaskIdValid) {
                    res.send('Task id ('+ taskToAdd.taskId +') already exists. Please provide unique task id.').status(400);
                } else if (!objValidation.isStatusBoolean) {
                    res.send('Task status is not boolean.').status(400);
                }
            }
        }

        console.log('----- POST /tasks: completed -----');
    } catch(ex) {
        console.log(ex);
        res.send('Internal server error').status(500);
        console.log('----- POST /tasks: failed -----');
    }
});

// PUT /tasks: Update an existing task by its ID.
taskRoutes.put('/', (req, res) => {
    try {
        console.log('----- PUT /tasks: started -----');
        
        const taskToUpdate = req.body;
        const objValidation = taskValidator.validateUpdateTaskObject(taskToUpdate, taskStore);

        if (taskToUpdate && objValidation.isValid) {
            const taskToUpdateIndex = taskStore.task.findIndex(t => t.taskId === taskToUpdate.taskId);
            if (taskToUpdateIndex > -1) {
                taskStore.task[taskToUpdateIndex] = taskToUpdate;
                res.send(taskToUpdate).status(200);
            } else {
                res.send('Task id ('+taskToUpdate.taskId+') does not exist.').status(400);
            }
        } else {
            if (!objValidation.isValid) {
                if (!objValidation.isRequiredPropertiesValid) {
                    res.send('Invalid required properties for task object.').status(400);
                } else if (!objValidation.isStatusBoolean) {
                    res.send('Task status is not boolean.').status(400);
                }
            }
        }

        console.log('----- PUT /tasks: completed -----');
    } catch(ex) {
        console.log(ex);
        res.send('Internal server error').status(500);
        console.log('----- PUT /tasks: failed -----');
    }
});

// DELETE /tasks/:id: Delete a task by its ID.
taskRoutes.delete('/:id', (req, res) => {
    try {
        console.log('----- DELETE /tasks: started -----');
        
        const taskIdToDelete = req.params.id;
        const index = taskStore.task.findIndex(t => t.taskId === taskIdToDelete);
        if (index > -1) {
            taskStore.task.splice(index,1);
            res.send('Task id ('+ taskIdToDelete +') Successfully deleted').status(200);
        } else {
            res.send('Task id ('+ taskIdToDelete +') doesn\'t exist.').status(400);
        }

        console.log('----- DELETE /tasks: completed -----');
    } catch(ex) {
        console.log(ex);
        res.send('Internal server error').status(500);
        console.log('----- DELETE /tasks: failed -----');
    }
});

module.exports = taskRoutes;