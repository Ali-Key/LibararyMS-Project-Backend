import server from "./api/server.js";
const PORT = 5000 ;


server.listen(PORT, () => {
    console.log(`Server is running on  :${PORT}`);
});