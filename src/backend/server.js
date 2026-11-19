//Authors: Sam Oystreck (A00478278)
//         OpenAI ChatGPT
//Purpose: Contains the server which serves as the backbone to the gallery and admin pages

//Imports
const express = require('express');
const server = express();
const cors = require('cors');
const path = require("path");
const fs = require('fs');
const multer = require("multer");
require('dotenv').config();
const siteHost = process.env.SITE_ORIGIN;

// ----------------- SETUP -----------------
//Ensures server will act properly
server.use(cors({ origin: siteHost }));
server.use(express.json());

//Setting up directory
const directory = path.resolve();

/**
 * Keeps only the file name from a name sent by the browser, so a request
 * can't reach files outside the gallery folders (e.g. "../../.env").
 *
 * @param {string} filename - The name sent in the request.
 * @returns {string} The bare file name, or "" if none was sent.
 */
const safeName = (filename) => path.basename(String(filename || ""));

/**
 * Description files are optional (photos uploaded before descriptions existed
 * don't have one), so "file not found" is not treated as an error.
 *
 * @param {Error|null} err - The error from fs.rename or fs.unlink.
 * @returns {boolean} True only for errors other than "file not found".
 */
const descriptionErrorIsReal = (err) => Boolean(err) && err.code !== "ENOENT";



/**
 * Get description for an accepted image.
 */
server.get("/api/description/:filename", (req, res) => {

    const filename = safeName(req.params.filename);

    const descriptionPath = path.join(
        directory,
        "gallery_uploads/description",
        `${filename}~desc.txt`
    );

    fs.readFile(descriptionPath, "utf8", (err, data) => {

        if (err) {
            return res.json({
                description: "No description available."
            });
        }

        res.json({
            description: data
        });
    });
});

/**
 * Get description for a pending image.
 */
server.get("/api/pendingDescription/:filename", (req, res) => {

    const filename = safeName(req.params.filename);

    const descriptionPath = path.join(
        directory,
        "gallery_uploads/description(pending)",
        `${filename}~desc.txt`
    );

    fs.readFile(descriptionPath, "utf8", (err, data) => {

        if (err) {
            return res.json({
                description: "No description available."
            });
        }

        res.json({
            description: data
        });

    });
});


/**
 * Multer storage configuration for pending image uploads.
 * 
 * @param {Object} req - Express request object
 * @param {Object} file - Uploaded file object
 * @param {Function} cb - Callback to specify destination/filename
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(directory, "gallery_uploads/pending"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });
// ----------------- SETUP -----------------

// ----------------- ENDPOINTS -----------------
/**
 * Get all accepted images.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
server.get("/api/acceptedImages", (req, res) => {
    //fs.readdir gives a list of all subdirectories in a given directory
    fs.readdir(path.join(directory, "/gallery_uploads/accepted"), (err, fileNames) => {
        if (err) {
            console.log("Failed to read images");
        }

        res.json(fileNames);
    });
});


/**
 * Get all pending images.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
server.get("/api/pendingImages", (req, res) => {
    fs.readdir(path.join(directory, "gallery_uploads/pending"), (err, fileNames) => {
        if (err) {
            console.log("Failed to read images");
            return res.json([]);
        }
        res.json(fileNames);
    });
});


/**
 * Update the description of an accepted image.
 *
 * Expects:
 * {
 *   filename: "image.jpg",
 *   description: "new description"
 * }
 */
server.post("/api/updateDescription", (req, res) => {

    const filename = safeName(req.body.filename);
    const description = req.body.description ?? "";

    if (!filename) {
        return res.status(400).json({ error: "No image was given" });
    }

    // Only save descriptions for photos that are actually in the gallery.
    if (!fs.existsSync(path.join(directory, "gallery_uploads/accepted", filename))) {
        return res.status(404).json({ error: "Image not found" });
    }

    const descriptionPath = path.join(
        directory,
        "gallery_uploads/description",
        `${filename}~desc.txt`
    );

    fs.writeFile(descriptionPath, description, (err) => {

        if (err) {
            console.log("DESCRIPTION UPDATE FAILED:");
            console.log(err);

            return res.status(500).json({
                error: "Failed to update description"
            });
        }

        console.log(`Description updated for ${filename}`);

        res.json({
            success: true,
            filename,
            description
        });
    });
});

/**
 * Accept a pending image (move to accepted folder).
 * 
 * @param {Object} req - Express request object containing { filename }
 * @param {Object} res - Express response object
 */
server.post("/api/accept", (req, res) => {

    const filename = safeName(req.body.filename);

    if (!filename) {
        return res.status(400).json({ error: "No image was given" });
    }

    const pendingPath = path.join(
        directory,
        "gallery_uploads/pending",
        filename
    );

    const acceptedPath = path.join(
        directory,
        "gallery_uploads/accepted",
        filename
    );

    const pendingPathDesc = path.join(
        directory,
        "gallery_uploads/description(pending)",
        `${filename}~desc.txt`
    );

    const acceptedPathDesc = path.join(
        directory,
        "gallery_uploads/description",
        `${filename}~desc.txt`
    );

    fs.rename(pendingPath, acceptedPath, (err) => {

        if (err) {
            return res.status(500).json({
                error: "Failed to accept image"
            });
        }

        fs.rename(
            pendingPathDesc,
            acceptedPathDesc,
            (err) => {

                if (descriptionErrorIsReal(err)) {
                    console.log("DESCRIPTION MOVE FAILED:");
                    console.log(err);

                    return res.status(500).json({
                        error:
                            "Failed to accept image description"
                    });
                }

                console.log(
                    `Accepted image and description: ${filename}`
                );

                res.json({
                    success: true,
                    filename
                });
            }
        );
    });
});


/**
 * Deny a pending image (delete from pending folder and description).
 * 
 * @param {Object} req - Express request object containing { filename }
 * @param {Object} res - Express response object
 */
server.post("/api/deny", (req, res) => {

    const filename = safeName(req.body.filename);

    if (!filename) {
        return res.status(400).json({ error: "No image was given" });
    }

    const pendingPath = path.join(
        directory,
        "gallery_uploads/pending",
        filename
    );

    const pendingPathDesc = path.join(
        directory,
        "gallery_uploads/description(pending)",
        `${filename}~desc.txt`
    );

    fs.unlink(pendingPath, (err) => {

        if (err) {
            return res.status(500).json({
                error: "Failed to deny image"
            });
        }

        fs.unlink(pendingPathDesc, (err) => {

            if (descriptionErrorIsReal(err)) {
                return res.status(500).json({
                    error: "Failed to deny image description"
                });
            }

            res.json({
                success: true,
                filename
            });
        });
    });
});


server.post("/api/remove", (req, res) => {

    const filename = safeName(req.body.filename);

    if (!filename) {
        return res.status(400).json({ error: "No image was given" });
    }

    const acceptedPath = path.join(
        directory,
        "gallery_uploads/accepted",
        filename
    );

    const acceptedPathDesc = path.join(
        directory,
        "gallery_uploads/description",
        `${filename}~desc.txt`
    );

    fs.unlink(acceptedPath, (err) => {

        if (err) {
            return res.status(500).json({
                error: "Failed to remove image"
            });
        }

        fs.unlink(acceptedPathDesc, (err) => {

            if (descriptionErrorIsReal(err)) {
                return res.status(500).json({
                    error: "Failed to remove image description"
                });
            }

            res.json({
                success: true,
                filename
            });
        });
    });
});

/**
 * Upload one or more images to the pending folder.
 * 
 * @param {Object} req - Express request object containing uploaded files
 * @param {Object} res - Express response object returning uploaded filenames
 */
server.post("/api/upload", upload.array("image"), (req, res) => {

    const filenames = req.files.map(f => f.filename);

    // An upload without a description gets an empty description file.
    const prompt = req.body.prompt || "";

    filenames.forEach((filename) => {

        const descriptionPath = path.join(
            directory,
            "gallery_uploads/description(pending)",
            `${filename}~desc.txt`
        );

        fs.writeFileSync(descriptionPath, prompt);
    });

    res.json({
        filenames
    });
});
// ----------------- ENDPOINTS -----------------

// ----------------- FUNCTIONALITY -----------------
//Serves static images to be accessed by the fronted
//Makes images in gallery_uploads/accepted accessable from https://pathname/gallery/imagename
server.use("/api/accepted", express.static(path.join(directory, "gallery_uploads/accepted")));
server.use("/api/pending", express.static(path.join(directory, "gallery_uploads/pending")));


//Starts the server - while on SSH access using http://ugdev.cs-smu.ca:3100/api
const PORT = process.env.PORT || 3100;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error("SERVER LISTEN ERROR:", err);
});
// ----------------- FUNCTIONALITY -----------------