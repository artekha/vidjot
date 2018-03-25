const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const db = require('./config/database');


const app = express();
const port = process.env.PORT || 5000;

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.successMsg = req.flash('successMsg');
  res.locals.errorMsg = req.flash('errorMsg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI)
.then(() => {
  console.log('MongoDB connected!')
})
.catch(err => {
  console.log(err)
});

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

// About route
app.get('/about', (req, res) => {
  res.render('about');
});

app.use('/users', users);
app.use('/ideas', ideas);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
