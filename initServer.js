
const initServer = (app)=> {
    app.listen(5000, ()=> { 
        console.log("server is running to port 5000") 
    })
} 

module.exports = initServer

