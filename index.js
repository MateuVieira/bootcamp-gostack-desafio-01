const express = require('express');

const server = express();

server.use(express.json());

const projects = [
    {
        id: "1",
        title: "Novo projeto",
        tasks: ["Nova tarefa"]
    },
    {
        id: "2",
        title: "Novo projeto 2",
        tasks: ["Nova tarefa", "Nova tarefa 2"]
    },
    {
        id: "3",
        title: "Novo projeto 3",
        tasks: ["Nova tarefa", "Nova tarefa 2", "Nova tarefa 3"]
    },
];

let countRequests = 1;

server.use( (req, res, next) => {
    console.log(` Request number -> ${countRequests} `);

    next();

    countRequests++;
});

function checkProjectExists( req, res, next) {
    if(!req.body.id) {
        return res.status(400).json({ error: 'User id is required' });
    }

    const verifyIdInUse = projects
            .map( project => project.id == req.body.id)
            .reduce((a,b) => a+b);

    if(verifyIdInUse > 0) {
        return res.status(400).json({ error: 'Id exist' });
    }

    return next();
}

function checkIndexInArray( req, res, next) {

    const indexProject =findIndexProjectById(req.params.id);
    const project = projects[indexProject];

    if(!project) {
        return res.status(400).json({ error: 'Project does not exists' });
    }

    req.project = project;

    return next();
}

function checkIndexTaskInArray( req, res, next) {


    const project = projects[req.params.id];

    if(!project) {
        return res.status(400).json({ error: 'User does not exists' });
    }

    req.project = project;

    return next();
}

function checkTitleExists( req, res, next) {
    if(!req.body.title) {
        return res.status(400).json({ error: 'User title is required' });
    }

    return next();
}

function findIndexProjectById(id) {
    const indexProject = projects.findIndex(project => project.id === id);
    return indexProject;
}

server.get('/projects', (req, res) => {
    
    return res.json(projects);
});

server.get('/projects/:id', checkIndexInArray, (req, res) => {
    return res.json(req.project);
});

server.post('/projects', checkProjectExists, checkTitleExists, (req, res) => {

    const { id, title, task = [] } = req.body;

    const project = {
        id,
        title,
        task
    };

    projects.push(project);

    res.json(projects);
});

server.post('/projects/:id/tasks', checkIndexTaskInArray, checkTitleExists, (req, res) => {

    const { title } = req.body;

    req.project.tasks.push(title);

    res.json(req.project);
});

server.put('/projects/:id', checkIndexInArray, checkTitleExists, (req, res) => {

    const  { id } = req.params;
    const { title } = req.body;

    const indexProject = findIndexProjectById(id)
    projects[indexProject].title = title;

    res.json(projects);
    
});

server.delete('/projects/:id', checkIndexInArray, (req, res) => {

    const  { id } = req.params;

    const indexProject = findIndexProjectById(id);

    projects.splice(indexProject, 1);

    res.send(projects);
});

server.listen(3000);



