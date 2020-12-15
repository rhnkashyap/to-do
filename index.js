const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./user');
const Task = require('./task');

mongoose
    .connect('mongodb+srv://rohan:kashyap@cluster0.ashkj.mongodb.net/toDoDB?retryWrites=true&w=majority')
    .then(() => {
        console.log("DB Connected");
    })
    .catch(err => {
        console.log("Error");
    })


const app = express();
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/create-user', function(req, res){

    const name = req.body.name;

    var result = User.findOne({name:name})
    .then(rohan => {
        if(rohan !== null) {
            return res.json({message: "User exists!"});
        }

        // User does not exists, create new
        User.create({
            name: req.body.name,
        })
        .then(rohan => {
            return res.json({user: rohan})
        })
        .catch(err => {
            return res.json({error: "Something went wrong"});
        })
    })
    .catch(error => {
        
        console.log("result catch");
        return res.json({error: "Something went wrong"});
        
    })
});

app.post('/create-task', function(req, res){

    const name = req.body.name;
// 1. Check if user exists in system

User.findOne({name:name})
.then(rohan => {

    console.log(rohan, req.body);
    if(rohan !== null) {

        // 2. If it does, create a task for him
        Task.create({
            name: rohan.name,
            title: req.body.title,
            desc: req.body.desc
        })
        .then(task => {
            return res.json({message: "Task Created!!", task: task})
        })
        .catch(err => {
            return res.status(500).json({error: "Internal server error!! :( "})
        })

    } else {
        return res.status(400).json({error: "User doesn't exists!!"})
    }
});
});

app.post('/list-task', function(req, res){
    const name = req.body.name;

    Task.find({name:name})
    .then(tasks => {
        return res.json({message: "Tasks found for user "+ name, tasks: tasks})
    })
    .catch(err => {
        return res.json({err: "Internal server error"})
    })

});

app.delete('/delete-task/:id', function(req, res){
    const id = req.params.id;

    Task.findById(id)
    .then(task => {
        task.remove()
        .then(delTask => {
            return res.json({message: "Task "+ id +" deleted"});
        })
        .catch(err => {
            return res.status(500).json({err: "Internal Server error!!"})
        })
    })
    .catch(err => {
        return res.status(500).json({err: "Internal Server error!!"})
    })
});


app.listen(3000, () => {
	console.log("listening at 3000");
});