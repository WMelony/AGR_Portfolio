# Professional Portfolio Website

A modern, responsive portfolio website with a dim theme. This portfolio includes three main pages: Home, About, and Skills, along with a contact form and social media integration.

## Features

- Responsive design that works on all devices
- Modern dim theme with professional color scheme
- Smooth scrolling navigation
- Animated skill bars
- Contact form with validation
- Social media integration
- Project showcase section
- About me section with background information
- Skills section with progress bars

## Setup

1. Clone this repository or download the files
2. Open `index.html` in your web browser
3. Customize the content as needed (see Customization section)

## Customization

### Content

1. **Home Page (`index.html`)**
   - Update the hero section text
   - Add your own projects to the Featured Work section
   - Update social media links
   - Modify the contact form as needed

2. **About Page (`about.html`)**
   - Add your profile picture (replace the placeholder)
   - Update your background story
   - Add your education and experience
   - Modify the layout as needed

3. **Skills Page (`skills.html`)**
   - Update the skills categories
   - Modify skill levels (0-100)
   - Add or remove skills as needed

### Styling

The website uses CSS variables for easy theme customization. You can modify the colors in `styles.css`:

```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #34495e;
    --accent-color: #3498db;
    --text-color: #ecf0f1;
    --text-secondary: #bdc3c7;
    --background-color: #1a1a1a;
    --card-background: #2d2d2d;
    --hover-color: #3d3d3d;
}
```

### Contact Form

The contact form currently logs the form data to the console. To make it functional:

1. Set up a backend server
2. Modify the form submission handler in `script.js`
3. Add your server endpoint to handle the form data

## Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- JavaScript (ES6+)
- Font Awesome Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Feel free to fork this repository and submit pull requests for any improvements.

## License

This project is open source and available under the MIT License. 