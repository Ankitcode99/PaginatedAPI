const dotenv = require('dotenv')
dotenv.config({path:'./config/config.env'});

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const User = require('./user');

const PORT =  process.env.PORT;
const app = express();

// mongoose.connect('mongodb://localhost/paginationDB',{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// })

app.use(express.json());
app.use(helmet());

const posts = [
    { id: 1, label: 'Post #1' },
    { id: 2, label: 'Post #2' },
    { id: 3, label: 'Post #3' },
    { id: 4, label: 'Post #4' },
    { id: 5, label: 'Post #5' },
    { id: 6, label: 'Post #6' },
    { id: 7, label: 'Post #7' },
    { id: 8, label: 'Post #8' },
    { id: 9, label: 'Post #9' },
    { id: 10, label: 'Post #10' },
    { id: 11, label: 'Post #11' },
    { id: 12, label: 'Post #12' },
    { id: 13, label: 'Post #13' },
    { id: 14, label: 'Post #14' },
    { id: 15, label: 'Post #15' },
    { id: 16, label: 'Post #16' },
    { id: 17, label: 'Post #17' },
    { id: 18, label: 'Post #18' },
    { id: 19, label: 'Post #19' },
    { id: 20, label: 'Post #20' },
    { id: 21, label: 'Post #21' },
    { id: 22, label: 'Post #22' },
    { id: 23, label: 'Post #23' },
    { id: 24, label: 'Post #24' },
    { id: 25, label: 'Post #25' },
    { id: 26, label: 'Post #26' },
    { id: 27, label: 'Post #27' },
    { id: 28, label: 'Post #28' },
    { id: 29, label: 'Post #29' },
    { id: 30, label: 'Post #30' }
]

const paginateResults = (model)=>{
    return (req,res,next)=>{
        let limit = parseInt(req.query.limit);
        let page = parseInt(req.query.page);
        
        const st = (page-1)*limit;
        const en = page*limit ;

        // slice=>[st,en)
        const results = {};
        results.result = model.slice(st,en);
        if(en<model.length){
            results.next = {
                page: page+1,
                limit: limit
            }    
        }
        if(st > 0){
            results.previous = {
                page: page-1,
                limit: limit
            }
        }
        
        // saving to the result of API;
        res.paginatedResults = results;
        next();
    }
}

/**
 * Simple pagination
 */
app.get('/users',(req,res)=>{
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    
    const st = (page-1)*limit;
    const en = page*limit ;

    // slice=>[st,en)
    const results = {};
    results.result = users.slice(st,en);
    if(en<users.length){
        results.next = {
            page: page+1,
            limit: limit
        }    
    }
    if(st > 0){
        results.previous = {
            page: page-1,
            limit: limit
        }
    }
    

    res.json(results)
});

/**
 * Pagination using Middleware
 */
app.get('/posts',paginateResults(posts),(req,res)=>{
    res.json(res.paginatedResults)
})

const paginateResultsDB =  (model)=>{
    return async (req,res,next)=>{
        let limit = parseInt(req.query.limit);
        let page = parseInt(req.query.page);
        
        const st = (page-1)*limit;
        const en = page*limit ;

        // slice=>[st,en)
        const results = {};
        if(en<model.countDocument().exec()){
            results.next = {
                page: page+1,
                limit: limit
            }    
        }
        if(st > 0){
            results.previous = {
                page: page-1,
                limit: limit
            }
        }

        try{
            results.result = await model.find().limit(limit).skip(st).exec();
            res.paginatedResults = results;
            next();
        }catch(err){
            res.status(500).json({message:err.message})
        }
    }
}

/**
 * Pagination on data from DB
 */
app.get('/allusers',paginateResultsDB(User),(req,res)=>{
    res.json(res.paginatedResults);
})

app.listen(PORT,()=>console.log(`Server started on PORT ${PORT}`))