class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode || 500;  // 500 hata kodu varsayılan
        this.message = message || 'Internal Server Error'; // Mesaj da varsayılan
        this.isOperational = true;  // Bu hata 'operational' (kullanıcı tanımlı) bir hata
    }
}

const handleError = (err, res) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        status: "error",
        statusCode,
        message
    });
};

module.exports = {
    ApiError,
    handleError
};
