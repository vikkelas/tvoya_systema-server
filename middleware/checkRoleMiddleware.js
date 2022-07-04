module.exports = (req, res, next)=>{
    const {user} = req;
    if(user.role!=='ADMIN'){
        return res.status(403).json({message: 'Доступ запрещен'});
    }
    next();
}
