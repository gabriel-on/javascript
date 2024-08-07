import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div style={{
                background: 'linear-gradient(rgba(44, 62, 80, 0.8), rgba(44, 62, 80, 0.8)), url(https://images.unsplash.com/photo-1713470599405-3ca0ae1363f8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) no-repeat center center/cover',
                color: 'white',
                textAlign: 'center',
                padding: '5em 2em'
            }}>
                <Container>
                    <Typography variant="h2" component="h2" gutterBottom>
                        Consertamos seu celular rapidamente!
                    </Typography>
                    <Typography variant="h5" component="p" gutterBottom>
                        Especialistas em reparo de telas, baterias e muito mais.
                    </Typography>
                    <Button variant="contained" color="primary">Entre em Contato</Button>
                </Container>
            </div>
        </motion.div>
    );
};

export default Hero;
