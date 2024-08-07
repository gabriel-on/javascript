import React from 'react';
import { Container, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div id="contact" style={{ padding: '4em 2em', backgroundColor: '#ecf0f1' }}>
                <Container>
                    <Typography variant="h4" component="h2" gutterBottom style={{ textAlign: 'center', marginBottom: '1.5em', color: '#333' }}>
                        Entre em Contato
                    </Typography>
                    <Paper elevation={3} style={{ padding: '2em', marginTop: '2em' }}>
                        <form noValidate autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="name"
                                        label="Nome"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{ style: { fontSize: 18 } }}
                                        InputProps={{ style: { fontSize: 16 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="email"
                                        label="E-mail"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{ style: { fontSize: 18 } }}
                                        InputProps={{ style: { fontSize: 16 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="message"
                                        label="Mensagem"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        InputLabelProps={{ style: { fontSize: 18 } }}
                                        InputProps={{ style: { fontSize: 16 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ textAlign: 'center' }}>
                                    <Button variant="contained" color="primary" type="submit" style={{ fontSize: 16, padding: '0.75em 1.5em' }}>
                                        Enviar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </div>
        </motion.div>
    );
};

export default Contact;
