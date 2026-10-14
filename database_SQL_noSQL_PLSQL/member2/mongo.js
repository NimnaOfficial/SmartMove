// ===================================================================
// Data Management 2 - Coursework 1
// Student Name : Arshath MLM
// Student ID   : COHNDSE261F-036
// Responsibility : Member 2 - MongoDB Queries 1 & 2
// Database     : smartmove
// ===================================================================

// Select the database (supports both Atlas SMARTMOVE and local smartmove)
var currentDb = db.getName();
var targetDb = "SMARTMOVE";
try {
    var existingDbs = db.getMongo().getDBNames();
    var found = existingDbs.find(function(n) { return n.toUpperCase() === "SMARTMOVE"; });
    if (found) { targetDb = found; }
    else if (currentDb && currentDb.toUpperCase() === "SMARTMOVE") { targetDb = currentDb; }
} catch (e) {
    if (currentDb && currentDb.toUpperCase() === "SMARTMOVE") { targetDb = currentDb; }
}
db = db.getSiblingDB(targetDb);


// -------------------------------------------------------------------
// QUERY 1: Retrieve all passenger reviews for a specific route (e.g. Route 1: Colombo to Kandy)
// -------------------------------------------------------------------
// Explanation:
// Finds all feedback entries in the 'reviews' collection where routeId equals 1.
// Projects only relevant fields and sorts from newest to oldest.

db.reviews.find(
    { routeId: 1 },
    {
        _id: 0,
        passengerId: 1,
        rating: 1,
        type: 1,
        tags: 1,
        comment: 1,
        createdAt: 1
    }
).sort({ createdAt: -1 });


// -------------------------------------------------------------------
// QUERY 2: Identify highest-rated vehicles based on customer feedback
// -------------------------------------------------------------------
// Explanation:
// Uses an aggregation pipeline to group reviews by vehicleId, calculate
// the average star rating and total number of reviews, then sorts by
// highest rating descending and limits the output to top 5 vehicles.
//
// Pipeline stages:
//   1. $match   -> Excludes any reviews that don't have a vehicleId
//   2. $group   -> Groups reviews by vehicleId, calculates avg rating ($avg) & review count ($sum)
//   3. $project -> Cleans up field names and rounds the average rating to 2 decimal places
//   4. $sort    -> Orders vehicles by average rating descending, then total reviews descending
//   5. $limit   -> Returns top 5 vehicles

db.reviews.aggregate([
    {
        $match: {
            vehicleId: { $ne: null }
        }
    },
    {
        $group: {
            _id: "$vehicleId",
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
        }
    },
    {
        $project: {
            _id: 0,
            vehicleId: "$_id",
            averageRating: { $round: ["$averageRating", 2] },
            totalReviews: 1
        }
    },
    {
        $sort: {
            averageRating: -1,
            totalReviews: -1
        }
    },
    {
        $limit: 5
    }
]);