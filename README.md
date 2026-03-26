# Event & Concert Booking Platform

A full-stack event and concert booking platform built with modern web technologies.

## 🎯 Features

- **User Authentication**: Login/Register with secure validation
- **Event Browsing**: Dynamic event cards with ratings and pricing
- **Booking System**: Complete booking flow with payment integration
- **My Bookings**: View bookings with ticket management
- **Ticket Management**: QR code generation, download & print tickets
- **Payment Integration**: Multiple payment options (UPI, Card, Bank)
- **Responsive Design**: Mobile-friendly across all devices
- **Support System**: Customer support with contact form

## 🛠 Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Vanilla JS with async/await
- **QR Code Library** - Ticket generation

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.3.4** - Framework
- **PostgreSQL** - Database
- **Maven** - Build tool
- **RESTful APIs** - Backend services

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Node.js (for frontend development)

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/eventify
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Run the backend:
```bash
mvn spring-boot:run
```

### Frontend Setup
1. Open `index.html` in your browser or serve with a web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Or simply open index.html in browser
```

## 📱 Pages

- **Home** (`index.html`) - Event listing and discovery
- **My Bookings** (`bookings.html`) - User booking management
- **Payment** (`payment.html`) - Secure payment processing
- **Support** (`support.html`) - Customer support and contact
- **About** (`about.html`) - Company information

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Bookings
- `GET /api/bookings?userId={id}` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{id}` - Get booking details
- `DELETE /api/bookings/{id}` - Cancel booking

## 🎨 Features Highlight

### Smart Booking System
- Real-time availability checking
- Secure payment processing
- QR code ticket generation
- Email confirmations

### User Experience
- Responsive design for all devices
- Smooth animations and transitions
- Modern UI with gradient designs
- Accessibility features

### Security
- Password hashing with BCrypt
- Input validation and sanitization
- Secure API endpoints
- XSS protection

## 📦 Deployment

### GitHub Pages (Frontend Only)
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `gh-pages`)
4. Your site will be available at `https://username.github.io/repository-name`

### Full Stack Deployment
For production with backend:
- **Frontend**: Netlify, Vercel, or GitHub Pages
- **Backend**: Heroku, Railway, or AWS EC2 (free tiers available)
- **Database**: ElephantSQL, Supabase, or Railway (free tiers)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

**Sahil Jayant** - *Initial work* - [sahiljayant19](https://github.com/sahiljayant19)

## 📞 Support

For support, please visit our [Support Page](support.html) or create an issue in this repository.

📧 **Email:** sahiljayant19@gmail.com
💬 **GitHub Issues:** [Create an Issue](https://github.com/sahiljayant19/Eventify-Platform/issues)

---

⭐ **Star this repository if it helped you!**

This project demonstrates:
- **Full-stack development** skills
- **Modern web technologies** proficiency
- **Database management** experience
- **API design** and integration
- **Responsive design** expertise
- **Security best practices**
- **Version control** with Git
- **Problem-solving** abilities
