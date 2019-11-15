const express = require('express');

const server = express();
server.use(express.json());

const projects = [];

server.use((req, res, next) => {
    console.count("Quantidade de Requisições");
    next();
});

function checkIfProjectExists(req, res, next) {
    const project = projects.find(p => p.id == req.params.id);

    if(!project) {
        return res.status(400).json({ error: "The project does not exists." });
    }

    return next();
}

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = { id, title, tasks: [] };

    projects.push(project);

    return res.json(projects);
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);
    
    project.tasks.push(title);

    return res.json(projects);
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;
    
    return res.json(projects);
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex);

    return res.send();
});

server.listen(3000);