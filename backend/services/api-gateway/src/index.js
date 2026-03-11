import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("=============================================");
    console.log(`API Gatewaye jecutándose en el puerto ${PORT}`);
    console.log("=============================================");
});
