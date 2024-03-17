import express from 'express';

const app = express();
const port = 3003;

app.get('/delay', async (req, res) => {
    const duration = req.query.duration ?? 0;
    const status = req.query.status ?? 200;
    const error = (Math.random() >= 0.5);

    const myTimeout = setTimeout(() => {
        if(error) {
            console.error('Internal Server Error');
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            console.info('Server Request successful');
            res.status(status).json({ payload: { email: 'kontakt@thomas-schulte.de' } });
        }

        clearTimeout(myTimeout);
    }, duration);
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/delay?duration=0&status=200`);
});
