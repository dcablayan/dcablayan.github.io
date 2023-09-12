/* Reset default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Global styles */
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f9f9f9;
}

.container {
  max-width: 900px;
  margin: auto;
  padding: 0px 70px; 
}

/* Header */
header {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #222;
  padding: 20px 0;
  z-index: 100;
}

nav ul {
  list-style: none;
  text-align: center;
}

nav ul li {
  display: inline-block;
  margin-right: 20px;
}

nav ul li a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s;
}

nav ul li a:hover {
  color: #ccc;
}

/* Homepage */
#home {
  text-align: center;
  padding: 120px 50px 40px; /* Adjusted padding: top increased to accommodate the fixed header */
  background-color: #1e5e92;
  background-size: cover;
  background-position: center;
  color: whitesmoke;
}

#home h1 {
  font-size: 44px;
  margin-bottom: 10px;
}

#home h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

#home p {
  font-size: 16px;
  line-height: 1.5;
  padding: 20px; 
}

#home .btn {
  display: inline-block;
  background-color: #FF5252;
  color: #fff;
  padding: 12px 30px;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s;
  margin-top: 10px; 
}

#home .btn:hover {
  background-color: #FF1744;
}

/* Other sections */
.section {
  background-color: #f1f1f1;
  color: #000000;
  text-align: left;
  padding: 20px 0; 
}

.section h2 {
  font-size: 30px;
  margin-bottom: 10px; 
}

.section p {
  font-size: 16px;
}

/* Experience */
.experience {
  margin-top: 20px;
}

.experience p {
  font-size: 16px;
  line-height: 1.5;
}

.experience h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

/* Footer */
footer {
  background-color: #222;
  padding: 20px 0;
  text-align: center;
}

footer p {
  font-size: 14px;
  color: #fff;
}

.social-links {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.linkedin-icon,
.github-icon,
.email-icon,
.buymeacoffee-icon {
  margin: 10px 10px;
}

.linkedin-icon img,
.github-icon img,
.email-icon img {
  width: 40px;
  height: 40px;
}

.buymeacoffee-icon img {
  width: 130px;
  height: 40px;
}

h3 a:link,
h3 a:visited {
  color: inherit;
  text-decoration: none;
  border-bottom: 3px solid rgb(46, 145, 180);
  transition: border-bottom-color 0.3s;
}

h3 a:hover {
  border-bottom-color: #ccc; 
}

#contact-container {
  text-align: center;
}
