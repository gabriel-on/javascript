import React from 'react';
import { Container, Typography, Link } from '@mui/material';

const Footer = () => {
    return (
        <footer style={{ padding: '2em 0', backgroundColor: '#2c3e50', color: 'white', textAlign: 'center' }}>
            <Container>
                <Typography variant="body2">
                    &copy; 2024 Manutenção de Celulares. Todos os direitos reservados.
                </Typography>
                <Typography variant="body2">
                    Contato: (11) 1234-5678
                </Typography>
                <Typography variant="body2">
                    <Link href="#" color="inherit" underline="hover">
                        Voltar ao topo
                    </Link>
                </Typography>
            </Container>
        </footer>
    );
};

export default Footer;
