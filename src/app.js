const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//home page 
app.get('/', (req, res) => {
	res.send('hello from the app ');
});

app.listen(PORT, () => {
	console.log(`app listening in port ${PORT}`);
});
