import bcrypt from 'bcrypt';
var promise = require('promise');


export const hashPassword = (password) =>{
    //
    return new promise((resolve,reject)=>{
        bcrypt.genSalt(12,(err,salt) =>{
        if(err)
        {
            reject(err)
        }
        bcrypt.hash(password,salt,(err,hash) =>{
            if(err) {
                reject(err);
            }
            resolve(hash);
        });
       });
    });
};

export const comparePassword = (password,hashed) =>{
    //
    return bcrypt.compare(password,hashed);

}
