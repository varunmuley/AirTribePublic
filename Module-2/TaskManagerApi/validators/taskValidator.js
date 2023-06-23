class taskValidator {

    // Validate new task object
    static validateNewTaskObject(task, taskStore) {
        const validationResult = {            
            "isRequiredPropertiesValid" : taskValidator.validateRequiredProperties(task),
            "isTaskIdValid" : taskValidator.validateUniqueTaskId(task.taskId, taskStore),
            "isStatusBoolean": taskValidator.validateBooleanStatus(task.status)
        }
        validationResult['isValid'] = (validationResult.isRequiredPropertiesValid && validationResult.isTaskIdValid 
            && validationResult.isStatusBoolean);

        return validationResult;
    }

     // Validate update task object
    static validateUpdateTaskObject(task, taskStore) {
        const validationResult = {            
            "isRequiredPropertiesValid" : taskValidator.validateRequiredProperties(task),
            "isStatusBoolean": taskValidator.validateBooleanStatus(task.status)
        }
        validationResult['isValid'] = (validationResult.isRequiredPropertiesValid && validationResult.isStatusBoolean);
            
        return validationResult;
    }



    // Validate if required property exists
    static validateRequiredProperties(task) {
        let validationResult = true;

        const propertiesToValidate = ['taskId','title','description','status'];

        propertiesToValidate.forEach(prop => {
            if(!task.hasOwnProperty(prop)) {
                validationResult = false;
            }
        });

        return validationResult;
    }

    // Validate if task id is unique
    static validateUniqueTaskId(taskId, taskStore) {
        let validationResult = true;
        if (taskStore.task.find(task => task.taskId === taskId)) {
            validationResult = false;
        }
        return validationResult;
    }

    // Validate if status is boolean
    static validateBooleanStatus(taskStatus) {
        let validationResult = true;
        if(typeof taskStatus !== "boolean") {
            validationResult = false;
        }
        return validationResult;
    }
}

module.exports = taskValidator;