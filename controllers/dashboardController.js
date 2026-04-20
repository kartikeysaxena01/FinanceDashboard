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
exports.getCategorySummary = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const summary = await Record.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $sort: { totalAmount: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        return res.status(200).json({
            success: true,
            page,
            limit,
            summary
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }
};
exports.getRecentActivity=async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||10;
        const skip=(page-1)*limit;
        const totalRecords=await Record.countDocuments();
        const records=await Record.find()
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("createdBy","name email");

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
            records
        });
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