const express = require('express');
const path = require('path');

const app = express();
const port = 3007;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve static files (like CSS, JS, and images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main index file
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/about', (req, res) => {
    res.redirect('/#about');
});
app.get('/portfolio', (req, res) => {
    res.redirect('/#portfolio');
});

// Serve the My Work page
app.get('/z-garden', (req, res) => {
    res.render('z-garden');
});
app.get('/omar-portfolio', (req, res) => {
    res.render('omar-portfolio');
});
app.get('/digging-jim', (req, res) => {
    res.render('digging-jim');
});
app.get('/zagsystems-website', (req, res) => {
    res.render('zagsystems-website');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
});
