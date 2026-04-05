const Record=require('../model/Record');
exports.getSummary=async(req,res)=>{
    try{
        const result=await Record.aggregate([
            {
                $group:{
                    _id:"$type",
                    totalAmount:{$sum:"$amount"}
                }
            }
        ])
       let totalIncome=0;
       let totalExpense=0;
       result.forEach(item=>{
        if(item._id=='income'){
            totalIncome=item.totalAmount;
        }else if(item._id==="expense"){
            totalExpense=item.totalAmount;
        }
       })
       const netBalance=totalIncome-totalExpense;
       return res.status(200).json({
        success:true,
        totalIncome,
        totalExpense,
        netBalance
       })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}
exports.getCategorySummary=async(req,res)=>{
    try{
        const summary=await Record.aggregate([
            {
                $group:{
                    _id:"$category",
                    totalAmount:{$sum:"$amount"}
                }
            },
            {
                $sort:{totalAmount:-1}
            }
        ])
        return res.status(200).json({
            success:true,
            summary
        });
    }catch(error){
        return res.status(500).json({
            sucess:false,
            message:"Server Error"
        })
    }
}
exports.getRecentActivity=async(req,res)=>{
    try{
        const records=await Record.find()
        .sort({createdAt:-1})
        .limit(1)
        .populate("createdBy","name email");

        return res.status(200).json({
            success:true,
            records
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Server Error"
        })
    }
}
exports.getMonthlyTrends = async (req, res) => {
    try {

        const trends = await Record.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$date"
                        }
                    },

                    totalIncome: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "income"] },
                                "$amount",
                                0
                            ]
                        }
                    },

                    totalExpense: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", "expense"] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const trendsWithBalance = trends.map(trend => ({
            month: trend._id,
            totalIncome: trend.totalIncome,
            totalExpense: trend.totalExpense,
            netBalance: trend.totalIncome - trend.totalExpense
        }));

        return res.status(200).json({
            success: true,
            trends: trendsWithBalance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};