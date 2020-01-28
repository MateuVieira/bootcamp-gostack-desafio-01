const express = require('express');

const server = express();

server.use(express.json());

const projetcs = [
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

function checkUserExists( req, res, next) {
    if(!req.body.name) {
        return res.status(400).json({ error: 'User name is required' });
    }

    return next();
}

function checkIndexInArray( req, res, next) {

    const user = users[req.params.index];

    if(!user) {
        return res.status(400).json({ error: 'User does not exists' });
    }

    req.user = user;

    return next();
}

server.get('/users', (req, res) => {
    
    return res.json(users);
});

server.get('/users/:index', checkIndexInArray, (req, res) => {
    return res.json(req.user);
});

server.post('/users', checkUserExists, (req, res) => {

    const { name } = req.body;

    users.push(name);

    res.json(users);
});

server.put('/users/:index', checkUserExists, checkIndexInArray, (req, res) => {

    const  { index } = req.params;
    const { name } = req.body;

    users[index] = name;

    res.json(users);
    
});

server.delete('/users/:index', checkIndexInArray, (req, res) => {

    const  { index } = req.params;

    users.splice(index, 1);

    res.send();
});

server.listen(3000);

