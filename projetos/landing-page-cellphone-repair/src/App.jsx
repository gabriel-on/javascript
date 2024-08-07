import React from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Testimonials from './components/Testimonials.jsx';
import Footer from './components/Footer.jsx';
import './App.css';
import Contact from './components/Contact.jsx';

const App = () => {
    return (
        <div className="App">
            <Header />
            <Hero />
            <Services />
            <Testimonials />
            <Contact />
            <Footer />
        </div>
    );
};

export default App;
