const express = require('express')
const router = express.Router()
const multer = require('multer')

const firebase = require("firebase/app");
const { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyACOosHqRNNl_mvGJkVF01AEAwjX2PcgRY",
    authDomain: "auto-promo-ph-api.firebaseapp.com",
    projectId: "auto-promo-ph-api",
    storageBucket: "auto-promo-ph-api.appspot.com",
    messagingSenderId: "594783862675",
    appId: "1:594783862675:web:3fb6894b83486a3ef8b266",
    measurementId: "G-P2S0140CFC"
};

firebase.initializeApp(firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", (req, res) => {
    res.json("Firebase Storage");
});

router.post("/", upload.single("filename"), async (req, res) => {

    try {

        const dateTime = Date.now();

        const storageRef = ref(storage, `files/${req.file.originalname + "-" + dateTime}`);

        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };

        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        // by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);

        console.log('File successfully uploaded.');

        return res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        })

    } catch (error) {
        response.status(400).json({ message: error.message })
    }

});

module.exports = router