# Members Only

A Node.js and Express application allowing users to post messages that can optionally be viewed anonymously by non-members. This project uses Express for the server, EJS templating for views, and PostgreSQL to store and retrieve user and post data.

## Try It Out

The live demo can be found [here](https://members-only-production-4b47.up.railway.app/).

## Features

- **User Authentication:** Users can sign up, log in, and log out. Only authenticated users can create posts.
- **Membership Code:** Authenticated users enter a secret code to see author names and precise timestamps.
- **EJS Templating:** Renders views for page interactivity (signup, login, home, etc.).
- **PostgreSQL Integration:** Stores user accounts and message data.

## Project Structure

```
members-only
├── .env                     # Environment variables (ignored by Git)
├── app.js                   # Main application file
├── package.json             # Project metadata and dependencies
├── models/
│   └── pool.js              # PostgreSQL pool configuration
├── public/
│   └── styles.css           # CSS styles for the app
├── views/
│   ├── get-membership.ejs   # Member code form
│   ├── home.ejs             # Home page displaying posts
│   ├── index.ejs            # Landing page for signup/login
│   └── newMessage.ejs       # Form for creating new posts
└── README.md                # This file
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [PostgreSQL](https://www.postgresql.org/) running locally or remotely
- A configured `.env` file (see [Environment Variables](#environment-variables))

### Environment Variables

Create an `.env` file in the root directory with your database credentials, session secret, and membership code:

```plaintext
DATABASE=my_database
HOST=localhost
USER=my_user
PASSWORD=my_password
PORT=3000
MEMBERSHIP_CODE=my_membership_code
```

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/kyusuku/members-only.git
   cd members-only
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up the Database**  
   Create or modify tables for users and posts in PostgreSQL:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255),
     password VARCHAR(255),
     membership BOOLEAN DEFAULT false
   );

   CREATE TABLE posts (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255),
     message TEXT,
     added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Running the Application

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Sign-Up / Log-In:** Users create an account or log in before posting messages.
- **Get Membership:** Enter the secret membership code to see author names and precise post dates.
- **Anonymous View:** Without membership, user posts show “Anonymous” and no specific date.
- **Create New Posts:** Users can add new messages, which appear on the homepage.

## Customization

- **Views:** Modify EJS files in `views/` for different layouts or styling.
- **Routes:** Adjust routes in `app.js` or add new controllers to customize logic.
- **Database:** Update schemas or queries in `models/pool.js` or your database creation script.

## Acknowledgments

- **The Odin Project** for the “Members Only” concept and for excellent learning resources.
- **Passport.js** & **Express-Session** for easy authentication.
- **Express & EJS** for the straightforward server and templating approach.
- **PostgreSQL** for storing user credentials and posts.

## Security

- Keep your `.env` file out of version control.
- Use parameterized queries to avoid SQL injection.
- Only reveal post authors to valid members.
- Consider HTTPS in production to protect session data.
