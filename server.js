require('dotenv').config();
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const POKEDEX = require('./pokedex.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' });
    };
    // move to the next middleware
    next()
});

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

function handleGetTypes(req, res) {
    res.json(validTypes);
};

app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) {
    res.send('Hello Pokemon!');
};

app.get('/pokemon', function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;

    // filter our pokemon by name if name query param is present
    if (req.query.name) {
        response = response.filter(pokemon => 
            pokemon.type.includes(req.query.type)
        );
    };
    res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});