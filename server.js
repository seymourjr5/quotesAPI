const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

//quotes router mount
const quotesRouter = express.Router();
app.use('/api/quotes', quotesRouter);

//GET random quotes
quotesRouter.get('/random', (req, res, next) =>{
    const randQuote = getRandomElement(quotes);
    if(randQuote){
        res.send({
            quote: randQuote
        });
    }else{
        res.status(404).send();
    }
});

//GET all quotes or sepcified quotes by a person
quotesRouter.get('/', (req, res, next) =>{
    if(req.query.person !== undefined){
        let personQuote = quotes.filter(element => element.person === req.query.person);
        res.send({
            quotes: personQuote
        });
    }else{
        res.send({
            quotes: quotes
        })
    }
});

//POST to add new quotes
quotesRouter.post('/', (req, res, next) =>{
    const newQuote = {
        quote: req.query.quote,
        person: req.query.person
      };
      if (newQuote.quote && newQuote.person) {
        quotes.push(newQuote);
        res.send({ quote: newQuote });
      } else {
        res.status(400).send();
      }
});

// NOTE: For the following steps I have added id's to quotes array in data.js

//PUT to update quotes 
quotesRouter.put('/:id', (req, res, next) =>{
    let quoteId = req.params.id;
    let updatedQuote = req.query;
    if(quoteId){
        let index = quoteId -1;
        quotes[index] = updatedQuote;
        res.send(updatedQuote);
    }else{
        res.status(404).send();
    }
});

// DELETE to delete a quote
quotesRouter.delete('/:id', (req, res, next) =>{
    let quoteId = req.params.id;
    let quoteIndex = quoteId -1;
    if(quoteId){
        quotes.splice(quoteIndex);
        res.status(204).send();
    }else{
        res.status(404).send(); 
    }
});


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
