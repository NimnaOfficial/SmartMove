// 5. MongoDB Query 1 & 2

// Query 1: Reviews by route
db.reviews.find({ routeId: 1 }).sort({ createdAt: -1 });

// Query 2: Highest-rated vehicles/drivers (Aggregation)
db.reviews.aggregate([
    { $group: { _id: "$vehicleId", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },
    { $sort: { avgRating: -1, totalReviews: -1 } },
    { $limit: 10 }
]);