const roleMiddleware=(allowedRole)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            });
        }
        if(!allowedRole.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            })
        }
        next();
    }

}
module.exports=roleMiddleware;