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
    if(!req.body.title) {
        return res.status(400).json({ error: 'User title is required' });
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

    const project = projects[req.params.index];

    if(!project) {
        return res.status(400).json({ error: 'User does not exists' });
    }

    req.project = project;

    return next();
}

server.get('/projects', (req, res) => {
    
    return res.json(projects);
});

server.get('/projects/:index', checkIndexInArray, (req, res) => {
    return res.json(req.project);
});

server.post('/projects', checkProjectExists, (req, res) => {

    const { id, title, task = [] } = req.body;

    const project = {
        id,
        title,
        task
    };

    projects.push(project);

    res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {

    const { name } = req.body;

    users.push(name);

    res.json(users);
});

server.put('/projects/:index', checkProjectExists, checkIndexInArray, (req, res) => {

    const  { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    res.json(users);
    
});

server.delete('/projects/:index', checkIndexInArray, (req, res) => {

    const  { index } = req.params;

    users.splice(index, 1);

    res.send();
});

server.listen(3000);

