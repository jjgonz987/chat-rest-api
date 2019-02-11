const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const jwt_config = require("../config/jwt_config");


const connection = require('../config/connection');
const pool = connection;
const query = require("../config/query");


router.post('/register',(req, res)=>{
    
    //check for missing parameters
    const {username, password, email} = req.body;
    if(!username || !password || !email){
        res.status(409).json({"error": "missing information"});
    }
   
    pool.getConnection((error, connection)=>{
       connection.query(query.find_email,email,(err, result)=>{

            
            if(err){throw error;}
            if(result.length > 0)
            {
                res.json({"error": "User_Found"});
            }
            else{
            
                connection.query(query.find_username, username,(err, username_result)=>{
                    
                    if(err){throw err;}
                    if(username_result == 0){
                        bcrypt.genSalt(saltRounds, function(err, salt) {
                            bcrypt.hash(password, salt, function(err, hash) {
                                // Store hash in your password DB.
                                const my_hash_password = hash;
                                const add_user = [[username, my_hash_password, email]];

                                connection.query(query.insert_new_user, [add_user], (err, add_user_result)=>{
                                    
                                    if(err){throw err;}
                                    
                                    connection.query(query.find_email, email, (err, get_user_result)=>{
                                        let row = JSON.stringify(get_user_result)
                                        let data = JSON.parse(row);
    
                                        const user = {
                                            id: data[0].id,
                                            username: data[0].username,
                                            email: data[0].email,
                                    
                                        }
    
                                        jwt.sign({user: user}, jwt_config, (err, token) =>
                                        {
                                            res.json({"success": "valid","token": token});
                                        });
                                    })
                                })
                            });
                        });
                    }
                    else
                    {
                        res.json({
                            "error": "username taken"
                        }); 
                    }
                });
        }
       
       
       });

    });



})


module.exports = router;