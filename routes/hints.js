const hintsRoutes = (app, fs) => {
    
    // variables
    const dataPath = "./data/hints.json";
    
    const readFile = (
        callback,
        returnJson = false,
        filePath = dataPath,
        encoding = "utf8"
    ) =>{
        fs.readFile(filePath, encoding, (err, data) => {
            if (err) {
                throw err;
            }

            callback(returnJson ? JSON.parse(data) : data);
        });
    };

    const writeFile = (
        fileData,
        callback,
        filePath = dataPath,
        encoding = "utf8"
    ) => {
        fs.writeFile(filePath, fileData, encoding, (err) => {
            if (err) {
                throw err;
            }
            callback();
        });
    };


    // routes

    // READ ALL
    app.get("/all-the-hints", (req, res) => {
        fs.readFile(dataPath, "utf8", (err, data) => {
            if (err) {
            throw err;
            }

            res.send(JSON.parse(data));
        });
    });

    // READ ONE AT RANDOM
    app.get("/hint", (req, res) => {
        readFile((data) => {
        // get random hint
        const hintId = Math.random() * Object.keys(data).length + 1;
        data[hintId] = JSON.parse(req.body.data);
    
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send('Uma dica (provavelmente, a com ID :{hintId})foi atualizada');
        });
        }, true);
    });

    // CREATE
    app.post("/hint", (req, res) => {
        readFile((data) => {
            const newHintId = Object.keys(data).length + 1;
        
            // add the new hint
            data[newHintId] = JSON.parse(req.body.data);

            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(200).send("R-Dica salva com sucesso!");
            });
        }, true);
    });

    // UPDATE
    app.put("/hints/:id", (req, res) => {
        readFile((data) => {
        // update the new hint
        const hintId = req.params["id"];
        data[hintId] = JSON.parse(req.body.data);
    
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send("Uma dica (provavelmente, a com ID " + hintId + ")foi atualizada");
        });
        }, true);
    });

    // DELETE
    app.delete("/hints/:id", (req, res) => {
        readFile((data) => {
        // delete the hint
        const hintId = req.params["id"];
        delete data[hintId];
    
        writeFile(JSON.stringify(data, null, 2), () => {
            res.status(200).send("Você destruiu a minha dica " + hintId + ". A comunidade gamer fica triste com você...");
        });
        }, true);
    });

};
  
module.exports = hintsRoutes;