const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const routes = require("./routes");
const passport = require("passport");
const { jwtStrategy } = require("./middleware/passport");
const { convertToApiError, handleError } = require('./middleware/apiError');

// MongoDB bağlantısı
const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json()); // JSON body parsing
app.use(xss()); // XSS temizleme
app.use(mongoSanitize()); // MongoDB injection temizleme

app.use(passport.initialize());
passport.use('jwt',jwtStrategy ); 

app.use('/api', routes); // API rotalarını kullan

// Hata işleme middleware'i
app.use((err, req, res, next) => {
    console.error(err);  // Hata detaylarını console'a yazdırın
    handleError(err, res);  // Hata nesnesini 'handleError' fonksiyonuna gönderin
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
