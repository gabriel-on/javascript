import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const Services = () => {
    const services = [
        "Reparo de Tela",
        "Substituição de Bateria",
        "Correção de Problemas de Software",
        "Recuperação de Dados"
    ];

    return (
        <Container id="services" style={{ padding: '4em 2em' }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Nossos Serviços
            </Typography>
            <List>
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                    >
                        <ListItem>
                            <Paper style={{ width: '100%', padding: '1em' }}>
                                <ListItemText primary={service} />
                            </Paper>
                        </ListItem>
                    </motion.div>
                ))}
            </List>
        </Container>
    );
};

export default Services;
