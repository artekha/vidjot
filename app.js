const express = require('express');
const exphbs  = require('express-handlebars');

const app = express();
const port = 5000;

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Home route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
