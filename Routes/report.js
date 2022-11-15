const router = require('express').Router()
const Order = require('../Model/Order')
const Customer = require('../Model/Customer')
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken')


// GET LAST 3 MONTHS INCOME
router.get('/income', async (req, res)=> {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth()-2))

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte:  prevMonth},
                    payment_status: "PAID",
                    payment_status: {
                        $ne: 'Cancelled'
                    },
                    isDelivered: true
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$totalPayment"
                }
            },
            {
                $group: {
                    _id: "$month",
                    total_sales: { $sum: "$sales" } 
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        res.status(200).json(income)
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }

})



// TOTAL SALES FOR THIS MONTH
router.get('/total-sales', async (req, res)=> {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    try {
        const totalSales = await Order.aggregate([
            {
                $match: {
                    payment_status: "PAID",
                    payment_status: {
                        $ne: 'Cancelled'
                    },
                    createdAt: {
                        $gte: prevMonth
                    },
                    isDelivered: true

                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    total: "$totalPayment"
                }
            },
            {
                $group: {
                    _id: "$month",
                    sales: {
                        $sum: "$total"
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])

        res.status(200).json(totalSales)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

// GET TOTAL ORDERS FOR THIS MONTH
router.get('/total-orders', async (req, res)=> {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    try {
        const totalOrder = await Order.aggregate([
            {
                $match: {
                    payment_status: "PAID",
                    payment_status: {
                        $ne: 'Cancelled'
                    },
                    createdAt: {
                        $gte: prevMonth
                    },
                    isDelivered: true
                }
            },
           {
                $project: {
                    month: { $month: "$createdAt" },
                }
           },
           {
                $group: {
                    _id: "$month",
                    totalOrders: {
                        $sum: 1
                    }
                }
           },
           {
                $sort: {
                    _id: -1
                }
           }
        ])

        res.status(200).json(totalOrder)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

// TOTAL USERS FOR THIS MONTH
router.get('/total-users',  async (req, res)=> {
    const date = new Date()
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const prevMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    try {
        const totalCust = await Customer.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: prevMonth
                    }
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    totalUser: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])

        res.status(200).json(totalCust)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})




module.exports = router