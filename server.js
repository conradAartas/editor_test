const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

const Editor = require("./models").editor_test;

app.get("/get/:id", async (req, res) => {
    try {
        let id = req.params.id;
        if(!id) {
            res.status(400).json({status: false, message: "Invalid Id"});
        }
        let data = await Editor.findOne({ where: { id } });

        res.status(200).send({status: true, message: "success", data});

    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Internal Server Error"});
    }
});

app.get("/all", async (req, res) => {
    try {
        let data = await Editor.findAll({});

        res.status(200).send({status: true, message: "success", data});

    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Internal Server Error"});
    }
});

app.post("/create", async (req, res) => {
    try {
        let {title, json_data} = req.body;

        if(json_data && typeof json_data !== 'string') json_data = JSON.stringify(json_data);

        let newEditor = await Editor.create({title, json_data});

        if(newEditor){
            res.status(200).send({status: true, message: "success", data: newEditor});
        } else {
            res.status(400).json({status: false, message: "Failed to create editor"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Internal Server Error"});
    }
});

app.put("/update/:id", async (req, res) => {
    try {
        let id = req.params.id;
        if(!id) {
            res.status(400).json({status: false, message: "Invalid Id"});
        }
        let {title, json_data} = req.body;

        if(json_data && typeof json_data !== 'string') json_data = JSON.stringify(json_data);

        let editor = await Editor.findOne({ where: { id } });

        if(editor){
            editor.title = title;
            editor.json_data = json_data;
            await editor.save();

            res.status(200).send({status: true, message: "success", data: editor});
        } else {
            res.status(400).json({status: false, message: "Editor not found"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({status: false, message: "Internal Server Error"});
    }
});

app.use("*", (req, res) => {
    res.send("No route found");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});