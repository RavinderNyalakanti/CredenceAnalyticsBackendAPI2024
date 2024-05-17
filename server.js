const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json()); 
app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});

// Create a Mongoose schema
const movieSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String,
});

// Create a Mongoose model
const Movie = mongoose.model('movies', movieSchema);

// Routes
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/movies', async (req, res) => {
     try {
        const existName = await Movie.findOne({name: req.body.name}) 
        if (existName){
             return res.status(400).json({message: "Movie already exists"})
        } 
        const movie = new Movie({
             name: req.body.name, 
             img: req.body.img, 
             summary: req.body.summary
        }) 
        const newMovie = await movie.save(); 
        res.status(201).json(newMovie);
     } catch (error) {
          res.status(500).json({message: error.message})
     }
}); 

app.get('/movies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findById(new mongoose.Types.ObjectId(id));
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.put("/movies/:id",async(req,res)=>{ 
  try {
    const id = req.params.id; 

    const movie = await Movie.findByIdAndUpdate(id,req.body,{new:true}) 
    if (!movie){
       return res.status(404).json({message:'Movie Not Found'})
    } 
    res.json(movie) 
  } catch (error) {
    res.status(500).json({message: error.message})
  }    
}) 

app.delete('/movies/:id',async(req,res)=>{ 
  try {
    const id = req.params.id; 
    const movie = await Movie.findByIdAndDelete(id); 
    if(!movie){
       return res.status(404).json('Movie not found');
    } 
    res.json({message: "movie deleted successfully"})
  } catch (error) {
    res.status(500).json({message: error.message})
  }   
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
