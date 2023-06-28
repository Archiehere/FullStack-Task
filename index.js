// Imports the Google Cloud client library

const {Translate} = require('@google-cloud/translate').v2;
const express = require('express');
const cors=require('cors');
const rateLimit  = require('express-rate-limit');
const {errorMiddleware, ErrorHandler } = require('./middlewares/errors');
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');


let PORT=8080;

const translate = new Translate({
   keyFilename: './apikey.json'
});

const client = new textToSpeech.TextToSpeechClient({
    keyFilename: './apikey.json'
 });

const app = express();
	app.use(express.json());
	app.use(cors({origin:true}));
	app.use(express.urlencoded({ extended: false }));

    app.listen(PORT);
    console.log(`Connected to port ${PORT}`);

    const limiter = rateLimit({
		windowMs: 1 * 60 * 1000, // 1 minutes
		max: 30,				// max 30 requests
		standardHeaders: true,
		legacyHeaders: false
	});
	app.use(limiter);

	// Global Error Handling
	app.use(errorMiddleware);

    
    const translateText = async (req,res,next) => {
        try {
            const{text,target} = req.body;
            if(!text || !target){
               return next(new ErrorHandler(406,"text and target are required"));
            }
            let translations = await translate.translate(text, target);

            const request = {
                input: {text: translations[0]},
                // Select the language and SSML voice gender (optional)
                voice: {languageCode: 'hi-IN', ssmlGender: 'NEUTRAL'},
                // select the type of audio encoding
                audioConfig: {audioEncoding: 'MP3'},
              };
              const [response] = await client.synthesizeSpeech(request);


  return res.status(200).json({success:true, textdata:translations[0],audiodata:response});
} catch (err) {
    next(err);
}
}

app.use(express.static('dist'));
const path = require('path');
app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.post('/translate',translateText,errorMiddleware);


