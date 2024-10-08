import express from 'express';
import cors from 'cors';

// Starting
const app = express();
const port = 8000;


app.use(express.json());
app.use(cors());


// Users
let users = [];
let nextId = 1;

app.get('/', (req, res) => {
    res.send('Hello, Mohammed!');
});


app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const newUser = req.body;

    // if (!Array.isArray(newUsers)) {
    //     return res.status(400).json({ error: 'Input must be an array of users' });
    // }

    // const formattedUsers = newUsers.map(user => {
    //     const userWithId = {
    //         id: nextId++,
    //         name: user.name,
    //         email: user.email,
    //         password: user.password,
    //     };
    //     return userWithId;
    // });

    const userWithId = {
        id: nextId++,
        name: newUser.name || "",
        email: newUser.email || "",
        password: newUser.password || "",
    };

    users.push(userWithId);

    res.status(201).json(userWithId);
});


app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});


app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
        id: userId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };

    users[index] = updatedUser;
    res.json(updatedUser);
});


app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }


    Object.assign(user, req.body);
    res.json(user);
});


app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(index, 1);
    res.json(users);
    res.status(204).send();
});


// posts
let posts = []
app.get('/posts', (req, res) => {
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const newPost = req.body;


    if (!newPost.title || !newPost.content || !newPost.userId) {
        return res.status(400).json({ message: 'Title, content, and userId are required.' });
    }

    const newPostWithId = {
        id: posts.length + 1,
        title: newPost.title,
        content: newPost.content,
        userId: newPost.userId
    };


    posts.push(newPostWithId);
    res.json(newPostWithId);
});



// login
app.post('/login', (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password." });
    }

    if (user.email !== email) {
        return res.status(401).json({ message: "Invalid email." });
    }

    res.status(200).json({ message: "Login successful!", userId: user.id });
});

// sign in
app.post("/signin", (req, res) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (name.length < 3 || name.length > 10) {
        return res.status(400).json({ message: "Name should be between 3 and 10 characters." });
    }

    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
    }

    if (email.length < 3 || email.length > 30) {
        return res.status(400).json({ message: "Email should be between 3 and 30 characters." });
    }

    if (password.length < 6 || password.length > 20) {
        return res.status(400).json({ message: "Password should be between 6 and 20 characters." });
    }


    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: "Email is already taken." });
    }


    // const hashedPassword = bcrypt.hashSync(password, 10);


    const userWithId = {
        id: users.length + 1,
        name,
        email,
        password
    };


    users.push(userWithId);


    res.status(201).json({ message: "User created successfully!", userId: userWithId.id });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});