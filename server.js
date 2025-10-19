const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 12000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(express.static('.'));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        fs.ensureDirSync(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images and documents are allowed'));
        }
    }
});

// Data file paths
const DATA_DIR = path.join(__dirname, 'cms-data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and files exist
fs.ensureDirSync(DATA_DIR);

// Initialize default content if not exists
const initializeDefaultContent = () => {
    if (!fs.existsSync(CONTENT_FILE)) {
        const defaultContent = {
            hero: {
                name: "Rahul Thakur",
                title: ".NET Angular Developer & AI Engineer",
                description: "Dynamic and results-driven developer with expertise in .NET technologies and Angular framework. Currently contributing to critical software solutions at IIT Mandi, delivering scalable and user-centric applications.",
                stats: {
                    experience: 5,
                    projects: 50,
                    clients: 100
                }
            },
            about: {
                overview: "I am a passionate and experienced .NET Angular Developer with a strong background in full-stack development and AI engineering. With over 5 years of experience in the industry, I specialize in creating robust, scalable web applications using cutting-edge technologies.",
                details: {
                    name: "Rahul Thakur",
                    experience: "5+ Years",
                    location: "India",
                    availability: "Open to Opportunities"
                },
                education: [
                    {
                        title: "Bachelor's in Computer Science",
                        institution: "University Name",
                        period: "2015-2019"
                    },
                    {
                        title: "Microsoft Certified Developer",
                        institution: "Azure & .NET Technologies",
                        period: ""
                    }
                ]
            },
            skills: [
                {
                    category: "Backend Development",
                    icon: "fas fa-server",
                    skills: [
                        { name: "ASP.NET Core", level: 95, proficiency: "Expert" },
                        { name: "C#", level: 90, proficiency: "Expert" },
                        { name: "Entity Framework", level: 85, proficiency: "Advanced" },
                        { name: "Web API", level: 88, proficiency: "Advanced" }
                    ]
                },
                {
                    category: "Frontend Development",
                    icon: "fas fa-laptop-code",
                    skills: [
                        { name: "Angular", level: 92, proficiency: "Expert" },
                        { name: "TypeScript", level: 88, proficiency: "Advanced" },
                        { name: "HTML5/CSS3", level: 90, proficiency: "Expert" },
                        { name: "JavaScript", level: 85, proficiency: "Advanced" }
                    ]
                }
            ],
            projects: [],
            experience: [],
            testimonials: [],
            contact: {
                email: "rahulthakurhm@gmail.com",
                phone: "+919501893704",
                github: "https://github.com/9501893704rahul",
                linkedin: "",
                location: "India"
            }
        };
        fs.writeJsonSync(CONTENT_FILE, defaultContent, { spaces: 2 });
    }
};

// Initialize default admin user if not exists
const initializeDefaultUser = async () => {
    if (!fs.existsSync(USERS_FILE)) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@rahulthakur.dev',
                password: hashedPassword,
                role: 'admin'
            }
        ];
        fs.writeJsonSync(USERS_FILE, defaultUsers, { spaces: 2 });
        console.log('Default admin user created: admin / admin123');
    }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Helper functions
const getContent = () => {
    try {
        return fs.readJsonSync(CONTENT_FILE);
    } catch (error) {
        console.error('Error reading content:', error);
        return {};
    }
};

const saveContent = (content) => {
    try {
        fs.writeJsonSync(CONTENT_FILE, content, { spaces: 2 });
        return true;
    } catch (error) {
        console.error('Error saving content:', error);
        return false;
    }
};

// API Routes

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = fs.readJsonSync(USERS_FILE);
        const user = users.find(u => u.username === username);

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Content routes
app.get('/api/content', (req, res) => {
    const content = getContent();
    res.json(content);
});

app.get('/api/content/:section', (req, res) => {
    const content = getContent();
    const section = req.params.section;
    
    if (content[section]) {
        res.json(content[section]);
    } else {
        res.status(404).json({ error: 'Section not found' });
    }
});

app.put('/api/content/:section', authenticateToken, (req, res) => {
    try {
        const content = getContent();
        const section = req.params.section;
        
        content[section] = req.body;
        
        if (saveContent(content)) {
            res.json({ message: 'Content updated successfully', data: content[section] });
        } else {
            res.status(500).json({ error: 'Failed to save content' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// File upload routes
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: fileUrl,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve admin interface
app.use('/admin', express.static(path.join(__dirname, 'admin/build')));

app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/build/index.html'));
});

// Serve main website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize and start server
const startServer = async () => {
    try {
        initializeDefaultContent();
        await initializeDefaultUser();
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
            console.log(`🌐 Website: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();