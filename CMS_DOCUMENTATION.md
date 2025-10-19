# Rahul Thakur Portfolio CMS Documentation

## Overview
A comprehensive Content Management System (CMS) built for Rahul Thakur's portfolio website. This CMS provides a complete admin interface to manage all website content including hero section, about, skills, projects, experience, testimonials, and contact information.

## Features
- **Full CRUD Operations**: Create, Read, Update, Delete content for all sections
- **JWT Authentication**: Secure admin access with token-based authentication
- **File Upload System**: Support for image and document uploads with validation
- **Responsive Admin Interface**: Modern React-based admin dashboard with Tailwind CSS
- **RESTful API**: Clean API endpoints for all content management
- **Real-time Updates**: Changes reflect immediately on the website
- **Form Validation**: Comprehensive form validation with React Hook Form
- **Toast Notifications**: User-friendly feedback with React Hot Toast

## System Architecture

### Backend (Node.js/Express)
- **Server**: Express.js server with CORS support
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Storage**: Multer for handling file uploads with validation
- **Data Storage**: JSON file-based storage system
- **API Endpoints**: RESTful API for all content operations

### Frontend (React Admin Interface)
- **Framework**: React with React Router for navigation
- **Styling**: Tailwind CSS for modern, responsive design
- **Forms**: React Hook Form for form validation and handling
- **Icons**: Lucide React for consistent iconography
- **Notifications**: React Hot Toast for user feedback

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Git for version control

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/9501893704rahul/Rahulwebsite.git
   cd Rahulwebsite
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install admin interface dependencies:
   ```bash
   cd admin
   npm install
   cd ..
   ```

4. Build the admin interface:
   ```bash
   cd admin
   npm run build
   cd ..
   ```

5. Start the server:
   ```bash
   npm start
   ```

The server will start on port 12000 by default.

## Usage

### Accessing the Admin Interface
1. Open your browser and navigate to: `http://localhost:12000/admin`
2. Login with default credentials:
   - **Username**: admin
   - **Password**: admin123

### Admin Interface Sections

#### 1. Hero Section Editor
- Edit main title, subtitle, and description
- Update experience stats and project counts
- Manage call-to-action buttons

#### 2. About Section Editor
- Update personal overview and details
- Manage education history
- Edit certifications and achievements

#### 3. Skills Section Editor
- Organize skills by categories
- Set proficiency levels (0-100%)
- Add/remove skill categories and individual skills

#### 4. Projects Section Editor
- Add new projects with descriptions
- Upload project images
- Manage project links and GitHub repositories
- Specify technologies used

#### 5. Experience Section Editor
- Add work experience entries
- Specify job titles, companies, and durations
- Detail responsibilities and achievements

#### 6. Testimonials Section Editor
- Manage client testimonials
- Add client information and feedback
- Upload client photos

#### 7. Contact Section Editor
- Update contact information
- Manage social media links
- Edit location and availability status

#### 8. Settings Section Editor
- Configure site-wide settings
- Manage SEO metadata
- Update global configurations

## API Documentation

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@rahulthakur.dev",
    "role": "admin"
  }
}
```

### Content Management Endpoints

#### Get All Content
```
GET /api/content
```

#### Get Section Content
```
GET /api/content/{section}
```

#### Update Section Content
```
PUT /api/content/{section}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{section_data}
```

### File Upload Endpoint

#### Upload File
```
POST /api/upload
Authorization: Bearer {jwt_token}
Content-Type: multipart/form-data

Form Data:
- file: [image or document file]

Response:
{
  "message": "File uploaded successfully",
  "filename": "generated_filename",
  "originalName": "original_filename",
  "url": "/uploads/generated_filename",
  "size": file_size_in_bytes
}
```

### Supported Sections
- `hero` - Hero section content
- `about` - About section content
- `skills` - Skills and proficiency data
- `projects` - Project portfolio
- `experience` - Work experience
- `testimonials` - Client testimonials
- `contact` - Contact information
- `settings` - Site settings

## File Structure
```
Rahulwebsite/
├── server.js                 # Main server file
├── package.json              # Backend dependencies
├── content.json              # Content storage file
├── uploads/                  # Uploaded files directory
├── admin/                    # Admin interface
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── HeroEditor.js
│   │   │   ├── AboutEditor.js
│   │   │   ├── SkillsEditor.js
│   │   │   ├── ProjectsEditor.js
│   │   │   ├── ExperienceEditor.js
│   │   │   ├── TestimonialsEditor.js
│   │   │   ├── ContactEditor.js
│   │   │   └── SettingsEditor.js
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── package.json         # Frontend dependencies
│   └── build/               # Production build
└── CMS_DOCUMENTATION.md     # This documentation
```

## Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- File upload validation (images and documents only)
- CORS protection
- Input sanitization

## Testing

### API Testing Examples

#### Test Authentication
```bash
curl -X POST http://localhost:12000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Test Content Retrieval
```bash
curl http://localhost:12000/api/content/hero
```

#### Test Content Update
```bash
curl -X PUT http://localhost:12000/api/content/hero \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Updated Name","title":"Updated Title"}'
```

#### Test File Upload
```bash
curl -X POST http://localhost:12000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@image.jpg"
```

## Troubleshooting

### Common Issues

1. **Server won't start**
   - Check if port 12000 is available
   - Ensure all dependencies are installed
   - Verify Node.js version (18+ required)

2. **Admin interface not loading**
   - Ensure admin build is completed: `cd admin && npm run build`
   - Check server logs for errors
   - Verify server is running on correct port

3. **Authentication issues**
   - Check if JWT token is valid and not expired
   - Verify credentials are correct
   - Clear browser cache and cookies

4. **File upload failures**
   - Ensure file type is supported (images: jpg, jpeg, png, gif, webp; documents: pdf, doc, docx)
   - Check file size limits
   - Verify uploads directory exists and is writable

### Development Mode
For development, you can run the admin interface in development mode:
```bash
cd admin
npm start
```
This will start the React development server on port 3000.

## Customization

### Adding New Content Sections
1. Add the section to the content.json file
2. Create a new editor component in admin/src/pages/
3. Add the route to admin/src/App.js
4. Update navigation if needed

### Modifying Existing Sections
1. Update the editor component in admin/src/pages/
2. Modify the content structure in content.json if needed
3. Rebuild the admin interface

## Support
For issues or questions, please contact:
- Email: rahulthakurhm@gmail.com
- GitHub: https://github.com/9501893704rahul

## Version History
- **v1.0.0** - Initial CMS implementation with full CRUD operations for all sections

## Quick Start Summary

1. **Clone & Install**:
   ```bash
   git clone https://github.com/9501893704rahul/Rahulwebsite.git
   cd Rahulwebsite
   npm install
   cd admin && npm install && npm run build && cd ..
   ```

2. **Start Server**:
   ```bash
   npm start
   ```

3. **Access Admin**:
   - URL: http://localhost:12000/admin
   - Login: admin / admin123

4. **Test API**:
   ```bash
   curl http://localhost:12000/api/content/hero
   ```

The CMS is now ready for content management across all sections of Rahul Thakur's portfolio website!