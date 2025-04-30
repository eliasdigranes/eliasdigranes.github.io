const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Set up SQLite database connection
const db = new sqlite3.Database('./database/database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to the SQLite database.');

    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table created or already exists.');
    });

    // Create posts table
    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) console.error('Error creating posts table:', err);
      else console.log('Posts table created or already exists.');
    });

    // Create comments table
    db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        user_id INTEGER,
        post_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (post_id) REFERENCES posts(id)
      )
    `, (err) => {
      if (err) console.error('Error creating comments table:', err);
      else console.log('Comments table created or already exists.');
    });
  }
});

// Middleware and session setup
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secretkey123',
  resave: false,
  saveUninitialized: true
}));

// Pass user to views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
    if (err) return res.send('User exists or DB error');
    console.log('User registered:', username);
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.send('User not found');

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      req.session.user = user;
      res.redirect('/dashboard');
    } else {
      res.send('Wrong password');
    }
  });
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');

  db.all('SELECT * FROM posts WHERE user_id = ?', [req.session.user.id], (err, posts) => {
    if (err) {
      console.log(err);
      return res.send('Error fetching posts');
    }
    res.render('dashboard', { user: req.session.user, posts });
  });
});

app.post('/create-post', (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.user.id;

  db.run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, userId], (err) => {
    if (err) {
      console.log(err);
      return res.send('Error creating post');
    }
    res.redirect('/dashboard');
  });
});

// Route to add a comment to a specific post
app.post('/posts/:id/comments', (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;  // Get the postId from the URL
  const userId = req.session.user.id; // Get the logged-in user's ID
  
  // Insert the comment into the database
  db.run(
    'INSERT INTO comments (content, user_id, post_id) VALUES (?, ?, ?)',
    [content, userId, postId],
    (err) => {
      if (err) {
        console.log(err);
        return res.send('Error adding comment');
      }
      res.redirect('/post/' + postId);  // Redirect back to the post page
    }
  );
});

app.get('/post/:id', (req, res) => {
  const postId = req.params.id;

  db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
    if (err || !post) return res.send('Post not found');

    db.all(
      'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE post_id = ?',
      [postId],
      (err, comments) => {
        if (err) return res.send('Error fetching comments');
        res.render('post', { post, comments });
      }
    );
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
