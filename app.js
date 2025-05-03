require("dotenv").config();
const path = require("node:path");
const express = require("express");
const pool = require("./models/pool");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get("/", (req, res) => res.render("index"));

app.post("/sign-up", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const match = bcrypt.compareSync(
      req.body.passwordConfirmation,
      hashedPassword
    );
    if (!match) {
      return res.render("index", {
        error: "Your passwords do not match. Please try again.",
      });
    }
    await pool.query(
      "INSERT INTO users (username, password, membership) VALUES ($1, $2, $3)",
      [req.body.username, hashedPassword, false]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/",
  })
);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

app.get("/home", ensureAuthenticated, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT username, message, added FROM posts"
  );
  const posts = rows.map((post) => {
    return {
      username: post.username,
      message: post.message,
      added: post.added,
    };
  });
  res.render("home", { user: req.user, posts: posts });
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/get-membership", (req, res) => {
  res.render("get-membership", { user: req.user });
});

app.post("/get-membership", async (req, res) => {
  try {
    if (req.body.secretCode !== process.env.MEMBERSHIP_CODE) {
      return res.render("get-membership", {
        error: "Incorrect membership code. Please try again.",
        user: req.user,
      });
    }
    await pool.query("UPDATE users SET membership = $1 WHERE id = $2", [
      true,
      req.user.id,
    ]);
    res.redirect("/home");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.get("/new-post", (req, res) => {
  res.render("newMessage", { user: req.user });
});

app.post("/new-post", ensureAuthenticated, async (req, res) => {
  try {
    await pool.query(
      "INSERT INTO posts (username, message, added) VALUES ($1, $2, $3)",
      [req.user.username, req.body.message, new Date().toDateString()]
    );
    res.redirect("/home");
  } catch (err) {
    console.error(err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Members Only App listening on port ${PORT}!`)
);
