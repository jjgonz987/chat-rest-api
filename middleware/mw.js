function verify_token(req, res, next){

    const bearer = req.headers['authorization'];
    //console.log(bearer);

    if (typeof bearer !== 'undefined'){
        
        const split_string = bearer.split(' ');
        const user_token = split_string[1];
        req.token = user_token;
        next();
    } else{
        res.sendStatus(403);
    }

};

module.exports = verify_token;