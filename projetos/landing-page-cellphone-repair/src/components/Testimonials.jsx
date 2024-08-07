import React from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const testimonials = [
    { text: "Serviço rápido e eficiente, meu celular ficou como novo!", author: "João" },
    { text: "Preço justo e atendimento excelente.", author: "Maria" }
];

const Testimonials = () => {
    return (
        <Container id="testimonials" style={{ padding: '4em 2em', backgroundColor: '#bdc3c7' }}>
            <Typography variant="h4" component="h2" gutterBottom>
                O que nossos clientes dizem
            </Typography>
            <Grid container spacing={3}>
                {testimonials.map((testimonial, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.3 }}
                        >
                            <Paper style={{ padding: '2em' }}>
                                <Typography variant="body1" component="p" gutterBottom>
                                    "{testimonial.text}"
                                </Typography>
                                <Typography variant="subtitle1" component="p">
                                    - {testimonial.author}
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Testimonials;
