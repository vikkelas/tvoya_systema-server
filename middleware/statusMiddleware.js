module.exports = function (req, res, next){
    const {status} = req.user;
    if(!status){
        return res.status(403).json({message: 'Доступ запрещен, подтвердите почту'});
    }
    next();
}
