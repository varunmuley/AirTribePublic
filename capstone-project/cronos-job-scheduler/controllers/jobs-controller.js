const { container, TYPES } = require('../services/container');

const jobsService = container.get(TYPES.JobService);

const getAllJobs = async (req, res) => {
    try {
        const allJobs = await jobsService.getAllJobs();
        return res.status(200).send(allJobs);
    } catch(err) {
        console.log(`[Error] 'jobs-controller'->'getAllJobs' failed. Error: ${JSON.stringify(err)}`);
        return res.status(500).send("Internal server error.");;
    }
};

const getJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await jobsService.getJob(jobId);
        return res.status(200).send(job);
    } catch(err) {
        console.log(`[Error] 'jobs-controller'->'getJob' failed. Error: ${JSON.stringify(err)}`);
        return res.status(500).send("Internal server error.");;
    }
};

const createJob = async (req, res) => {
    try {
        const jobToCreate = req.body;
        const cretedJob = await jobsService.createJob(jobToCreate);
        if (cretedJob.error) {
            return res.status(500).send(cretedJob.message);
        }
        return res.status(200).send({ jobId: cretedJob.id});
    } catch(err) {
        console.log(`[Error] 'jobs-controller'->'createJob' failed. Error: ${JSON.stringify(err)}`);
        return res.status(500).send("Internal server error.");;
    }
};

const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const jobObjToUpdate = req.body;
        const updatedJob = await jobsService.updateJob(jobId, jobObjToUpdate);
        if (updateJob.error) {
            return res.status(500).send(updatedJob.message);
        }
        return res.status(200).send(updatedJob.dataValues);
    } catch(err) {
        console.log(`[Error] 'jobs-controller'->'updateJob' failed. Error: ${JSON.stringify(err)}`);
        return res.status(500).send("Internal server error.");
    }
};

module.exports = {
    getJob,
    getAllJobs,
    createJob,
    updateJob
};
