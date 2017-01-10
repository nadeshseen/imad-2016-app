var express = require('express'); //to create web server
var morgan = require('morgan');     //output logs
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    user:'nadeshseen',
    database:'nadeshseen',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:'db-nadeshseen-84869'
};

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});    

app.get ('/article-one',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});

app.get ('/article-two',function(req,res){
    res.send('Article two requested and well be served here');
});

app.get('/article-three',function(req,res){
    res.send('Article three requested and will be served here');
});
var pool = new Pool(config);
app.get('/test-db', function ( req , res ) {
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else {
            res.send(JSON.stringify(result.rows));
        }
        
    });
    
});

app.get('/articles/:articleName',function(req,res){
    //articleName === article.one
    //article[articleName] ==={} content object for article one
    
    pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName],function (err, result){
        if (err){
            res.status(500).send(err.toString());
            
        }else{
            if (result.rows.length===0){
                res.status(404).send('Article not found');
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});