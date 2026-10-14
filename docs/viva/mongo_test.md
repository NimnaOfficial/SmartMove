## 🛠 Step 0: How to Open and Prepare MongoDB

### Option A: Using the Terminal (mongosh) — Recommended for Viva

1. Open PowerShell or Command Prompt in the project folder.
2. If your database is empty or needs fresh viva data, run the seed script with one command:
   ```powershell
   mongosh "docs/mongodb/Mongo_Seed_Full_Viva_Data.js"
   ```
   *(Or from the member4 folder: `mongosh "database_SQL_noSQL_PLSQL/member4/seed_mongo_data.js"`)*
   This automatically creates all 4 collections, sets JSON Schema validators, builds indexes (including full-text index), and ingests rich test data.

3. Now open the interactive shell and switch to your database:
   ```javascript
   mongosh
   // If connected to Atlas:
   use SMARTMOVE;
   // If connected to local MongoDB:
   use smartmove;
   ```

4. Verify your 4 collections exist:
   ```javascript
   show collections;
   // Output: announcements, reviews, trip_media, vehicle_documents
   ```


### Option B: Using MongoDB Compass (GUI)

1. Open MongoDB Compass.
2. Click Connect (Atlas connection string or local `mongodb://localhost:27017`).
3. Click on the `SMARTMOVE` (or `smartmove`) database in the left sidebar.
4. Click on the target collection (reviews, vehicle_documents, or trip_media) and use the Filter or Aggregations tab.                                                     
   ──────
## 📌 QUERY 1: Retrieve All Passenger Reviews for a Specific Route

### 1. The Scenario

Operational managers want to inspect passenger ratings, comments, and feedback tags for a specific transit route (e.g., Route 1: Colombo to Kandy), ordered from newest to
oldest.

### 2. The Exact Query to Run

Copy and paste this into mongosh:

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

### 3. Step-by-Step Code Breakdown

• db.reviews.find(...): Queries the reviews collection.                                                                                                                   
• { routeId: 1 }: Selection Filter — only matches documents where routeId equals 1.                                                                                       
• { _id: 0, ... }: Projection — excludes the default _id field and returns only the fields needed by the application UI, saving network bandwidth.                        
• .sort({ createdAt: -1 }): Sorting — -1 sorts descending so the most recent passenger feedback appears first.

### 4. What the Output Looks Like

    [                                                                                                                                                                       
      {                                                                                                                                                                     
        "passengerId": 1,                                                                                                                                                   
        "rating": 5,                                                                                                                                                        
        "type": "REVIEW",                                                                                                                                                   
        "tags": [ "On Time", "Comfortable", "Clean" ],                                                                                                                      
        "comment": "Excellent trip! The luxury coach was very comfortable and arrived on time in Kandy.",                                                                   
        "createdAt": "2026-10-15T11:30:00.000Z"                                                                                                                             
      },                                                                                                                                                                    
      {                                                                                                                                                                     
        "passengerId": 5,                                                                                                                                                   
        "rating": 2,                                                                                                                                                        
        "type": "COMPLAINT",                                                                                                                                                
        "tags": [ "Delay", "Late Departure" ],                                                                                                                              
        "comment": "Departure delay of 45 minutes at Colombo terminal. No breakdown explanation given.",                                                                    
        "createdAt": "2026-10-12T16:45:00.000Z"                                                                                                                             
      }                                                                                                                                                                     
    ]                                                                                                                                                                       

### 5. What to Say to the Examiner

│ "Sir/Madam, Query 1 retrieves unstructured customer feedback for Route 1. In relational databases, storing tags and optional review fields requires junction tables. In
│ MongoDB, documents naturally store dynamic tag arrays (tags: ['On Time', 'Clean']). We use indexing on routeId to ensure the lookup runs in logarithmic time O(log N)."
──────
## 📌 QUERY 2: Identify Highest-Rated Vehicles or Drivers Based on Customer Feedback

### 1. The Scenario

Fleet management wants to reward top-performing drivers and vehicles by computing the mathematical average rating and total review volume across all passenger feedback.

### 2. The Exact Query to Run (Aggregation Pipeline)

Copy and paste this into mongosh:

    db.reviews.aggregate([                                                                                                                                                  
        // Stage 1: Filter out general reviews that don't have a vehicleId                                                                                                  
        {                                                                                                                                                                   
            $match: {                                                                                                                                                       
                vehicleId: { $ne: null }                                                                                                                                    
            }                                                                                                                                                               
        },                                                                                                                                                                  
        // Stage 2: Group by vehicleId, calculate average star rating and total reviews                                                                                     
        {                                                                                                                                                                   
            $group: {                                                                                                                                                       
                _id: "$vehicleId",                                                                                                                                          
                averageRating: { $avg: "$rating" },                                                                                                                         
                totalReviews: { $sum: 1 }                                                                                                                                   
            }                                                                                                                                                               
        },                                                                                                                                                                  
        // Stage 3: Clean up attributes and round rating to 2 decimal places                                                                                                
        {                                                                                                                                                                   
            $project: {                                                                                                                                                     
                _id: 0,                                                                                                                                                     
                vehicleId: "$_id",                                                                                                                                          
                averageRating: { $round: ["$averageRating", 2] },                                                                                                           
                totalReviews: 1                                                                                                                                             
            }                                                                                                                                                               
        },                                                                                                                                                                  
        // Stage 4: Sort descending by highest average rating, then by total reviews                                                                                        
        {                                                                                                                                                                   
            $sort: {                                                                                                                                                        
                averageRating: -1,                                                                                                                                          
                totalReviews: -1                                                                                                                                            
            }                                                                                                                                                               
        },                                                                                                                                                                  
        // Stage 5: Return top 5 fleet leaders                                                                                                                              
        {                                                                                                                                                                   
            $limit: 5                                                                                                                                                       
        }                                                                                                                                                                   
    ]);                                                                                                                                                                     

│ Tip for Drivers: If the examiner asks, "How would you do this for drivers instead of vehicles?", simply replace "$vehicleId" with "$driverId" in Stages 1, 2, and 3.

### 3. Step-by-Step Code Breakdown

• Stage 1 ($match): Acts like SQL WHERE vehicleId IS NOT NULL. It filters out reviews not tied to a vehicle before aggregation starts.                                    
• Stage 2 ($group): Acts like SQL GROUP BY vehicleId.                                                                                                                     
• $avg: "$rating" computes the arithmetic mean.                                                                                                                       
• $sum: 1 counts total reviews.                                                                                                                                       
• Stage 3 ($project): Formats output. $round: ["$averageRating", 2] prevents floating-point issues like 4.6666666667.                                                     
• Stage 4 ($sort): Acts like SQL ORDER BY averageRating DESC, totalReviews DESC.                                                                                          
• Stage 5 ($limit): Returns only the top 5 vehicles.

### 4. What the Output Looks Like

    [
      { "vehicleId": 3, "averageRating": 4.67, "totalReviews": 3 },
      { "vehicleId": 2, "averageRating": 4.5, "totalReviews": 4 },
      { "vehicleId": 1, "averageRating": 3.8, "totalReviews": 5 },
      { "vehicleId": 4, "averageRating": 1.67, "totalReviews": 3 }
    ]                                                                                                                                                                       

### 5. What to Say to the Examiner

│ "Sir/Madam, Query 2 is implemented using a 5-stage MongoDB Aggregation Pipeline ($match ➔ $group ➔ $project ➔ $sort ➔ $limit). This is the NoSQL equivalent of SQL GROUP
│ BY and ORDER BY, processing calculations in memory across BSON documents."                                                                                              
──────
## 📌 QUERY 3: Search Customer Complaints or Feedback Using Specific Keywords

### 1. The Scenario

Customer service managers need to search through thousands of passenger comments to find critical complaints containing words like "delay" or "breakdown".

### 2. Prerequisites (The Full-Text Index)

Before running the search, prove to the examiner that you created a Text Index:

    // Creates full-text index on the comment field:                                                                                                                        
    db.reviews.createIndex({ comment: "text" });                                                                                                                            

### 3. The Exact Query to Run (Full-Text Search with Relevance Scoring)

Copy and paste this into mongosh:

    db.reviews.find(                                                                                                                                                        
        {                                                                                                                                                                   
            $text: {                                                                                                                                                        
                $search: "delay breakdown"                                                                                                                                  
            }                                                                                                                                                               
        },                                                                                                                                                                  
        {                                                                                                                                                                   
            score: { $meta: "textScore" },                                                                                                                                  
            _id: 0,                                                                                                                                                         
            passengerId: 1,                                                                                                                                                 
            routeId: 1,                                                                                                                                                     
            rating: 1,                                                                                                                                                      
            type: 1,                                                                                                                                                        
            tags: 1,                                                                                                                                                        
            comment: 1,                                                                                                                                                     
            createdAt: 1                                                                                                                                                    
        }                                                                                                                                                                   
    ).sort({ score: { $meta: "textScore" } });                                                                                                                              

#### Bonus Verification: Search Specifically for Complaints

If the examiner asks, "How do you show only records flagged as COMPLAINT?":

    db.reviews.find(                                                                                                                                                        
        { type: "COMPLAINT" },                                                                                                                                              
        { _id: 0, routeId: 1, rating: 1, tags: 1, comment: 1 }                                                                                                              
    );                                                                                                                                                                      

### 4. Step-by-Step Code Breakdown

• $text: { $search: "delay breakdown" }: Uses MongoDB's full-text search engine to perform stemming and word tokenization on the indexed comment field.                   
• score: { $meta: "textScore" }: Projects a mathematical relevance score representing how many times the keywords appeared and how close they are.                        
• .sort({ score: { $meta: "textScore" } }): Sorts results descending by relevance score, putting the most urgent complaints at the top.

### 5. What the Output Looks Like

    [                                                                                                                                                                       
      {                                                                                                                                                                     
        "passengerId": 3,                                                                                                                                                   
        "routeId": 3,                                                                                                                                                       
        "rating": 2,                                                                                                                                                        
        "type": "COMPLAINT",                                                                                                                                                
        "tags": [ "Delay", "Breakdown" ],                                                                                                                                   
        "comment": "The bus suffered an unexpected breakdown near Kadugannawa. Delay of 2 hours waiting for replacement coach.",                                            
        "createdAt": "2026-09-25T14:00:00.000Z",                                                                                                                            
        "score": 1.5                                                                                                                                                        
      },                                                                                                                                                                    
      {                                                                                                                                                                     
        "passengerId": 5,                                                                                                                                                   
        "routeId": 1,                                                                                                                                                       
        "rating": 2,                                                                                                                                                        
        "type": "COMPLAINT",                                                                                                                                                
        "tags": [ "Delay", "Late Departure" ],                                                                                                                              
        "comment": "Departure delay of 45 minutes at Colombo terminal. No breakdown explanation given.",                                                                    
        "createdAt": "2026-10-12T16:45:00.000Z",                                                                                                                            
        "score": 1.45                                                                                                                                                       
      }                                                                                                                                                                     
    ]                                                                                                                                                                       

### 6. What to Say to the Examiner

│ "Sir/Madam, Query 3 demonstrates MongoDB Full-Text Indexing (comment: 'text'). Instead of slow regex table scans (LIKE %delay%), MongoDB uses an inverted index to      
search                                                                                                                                                                    
│ keywords. We project { score: { $meta: 'textScore' } } and sort by relevance, allowing the customer service team to triage severe breakdowns immediately."              
──────
## 📌 QUERY 4: Retrieve Vehicle Documents and Multimedia Information

### 1. The Scenario

• 4A: A fleet inspector needs to verify that a specific bus (Vehicle 1) has valid legal certificates (Insurance, Revenue License, Emission Test) and view vehicle photos.
• 4B: A dispatch officer needs to view operational multimedia (boarding photos, highway dashcam video) for a specific scheduled journey (Trip 1).

### 2. The Exact Queries to Run

#### Part 4A: Retrieve Vehicle Documents and Images for Vehicle ID 1

    db.vehicle_documents.find(                                                                                                                                              
        { vehicleId: 1 },                                                                                                                                                   
        {                                                                                                                                                                   
            _id: 0,                                                                                                                                                         
            vehicleId: 1,                                                                                                                                                   
            registration: 1,                                                                                                                                                
            documents: 1,                                                                                                                                                   
            images: 1                                                                                                                                                       
        }                                                                                                                                                                   
    );                                                                                                                                                                      

#### Part 4B: Retrieve Multimedia (Photos & Dashcam Video) for Trip ID 1

    db.trip_media.find(                                                                                                                                                     
        { tripId: 1 },                                                                                                                                                      
        {                                                                                                                                                                   
            _id: 0,                                                                                                                                                         
            tripId: 1,                                                                                                                                                      
            routeId: 1,                                                                                                                                                     
            mediaType: 1,                                                                                                                                                   
            caption: 1,                                                                                                                                                     
            url: 1,                                                                                                                                                         
            uploadedAt: 1                                                                                                                                                   
        }                                                                                                                                                                   
    ).sort({ uploadedAt: -1 });                                                                                                                                             

### 3. Step-by-Step Code Breakdown

• In Query 4A, notice the Embedded Document Pattern:                                                                                                                      
• documents: A nested array of certificate objects (type, fileName, url, status).                                                                                     
• images: A nested array of vehicle photos (type, url, caption).                                                                                                      
• In Query 4B, trip_media links to Oracle's relational TRIP_ID = 1, storing media metadata (mediaType: "IMAGE" or "VIDEO") and the CDN / S3 storage URL.

### 4. What the Output Looks Like

Output for 4A (Vehicle Documents):

    [                                                                                                                                                                       
      {                                                                                                                                                                     
        "vehicleId": 1,                                                                                                                                                     
        "registration": "ND-4521",                                                                                                                                          
        "documents": [                                                                                                                                                      
          {                                                                                                                                                                 
            "type": "INSURANCE",                                                                                                                                            
            "fileName": "ins_ND-4521_2026.pdf",                                                                                                                             
            "url": "https://smartmove-storage.s3.amazonaws.com/docs/ins_ND-4521_2026.pdf",                                                                                  
            "status": "VALID"                                                                                                                                               
          },                                                                                                                                                                
          {                                                                                                                                                                 
            "type": "REGISTRATION",                                                                                                                                         
            "fileName": "reg_ND-4521.pdf",                                                                                                                                  
            "url": "https://smartmove-storage.s3.amazonaws.com/docs/reg_ND-4521.pdf",                                                                                       
            "status": "VALID"                                                                                                                                               
          },                                                                                                                                                                
          {                                                                                                                                                                 
            "type": "REVENUE_LICENSE",                                                                                                                                      
            "fileName": "rev_ND-4521_2026.pdf",                                                                                                                             
            "url": "https://smartmove-storage.s3.amazonaws.com/docs/rev_ND-4521_2026.pdf",                                                                                  
            "status": "VALID"                                                                                                                                               
          }                                                                                                                                                                 
        ],                                                                                                                                                                  
        "images": [                                                                                                                                                         
          {                                                                                                                                                                 
            "type": "EXTERIOR_FRONT",                                                                                                                                       
            "url": "https://smartmove-storage.s3.amazonaws.com/media/ND-4521_front.jpg",                                                                                    
            "caption": "Volvo 9900 Luxury Coach - Front view"                                                                                                               
          }                                                                                                                                                                 
        ]                                                                                                                                                                   
      }                                                                                                                                                                     
    ]                                                                                                                                                                       

Output for 4B (Trip Media):

    [                                                                                                                                                                       
      {                                                                                                                                                                     
        "tripId": 1,                                                                                                                                                        
        "routeId": 1,                                                                                                                                                       
        "mediaType": "IMAGE",                                                                                                                                               
        "caption": "Volvo 9900 ready for departure at Colombo.",                                                                                                            
        "url": "https://smartmove-storage.s3.amazonaws.com/media/trip1_departure.jpg",                                                                                      
        "uploadedAt": "2026-10-15T07:45:00.000Z"                                                                                                                            
      }                                                                                                                                                                     
    ]                                                                                                                                                                       

### 5. What to Say to the Examiner

│ "Sir/Madam, Query 4 demonstrates why we adopted a Polyglot Persistence architecture. Storing legal documents and multimedia in Oracle would require creating multiple   
│ normalized tables (VEHICLE_DOCS, VEHICLE_IMAGES) and running expensive multi-table JOIN queries. In MongoDB, we use the Embedded Document Pattern to store certificates
│ and photos inside the vehicle envelope. The entire document is fetched in a single atomic read operation, which drastically improves response times for our mobile apps.
"                                                                                                                                                                         
──────
## 📋 Quick Cheat Sheet: All 4 Queries on One Screen

If the lecturer says, "Run all four MongoDB queries right now", paste this block into mongosh:

    use smartmove;                                                                                                                                                          
                                                                                                                                                                            
    // 1. Passenger reviews for Route 1                                                                                                                                     
    db.reviews.find({ routeId: 1 }, { _id: 0, passengerId: 1, rating: 1, comment: 1 }).sort({ createdAt: -1 });                                                             
                                                                                                                                                                            
    // 2. Highest-rated vehicles pipeline                                                                                                                                   
    db.reviews.aggregate([                                                                                                                                                  
        { $match: { vehicleId: { $ne: null } } },                                                                                                                           
        { $group: { _id: "$vehicleId", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } },                                                                       
        { $project: { _id: 0, vehicleId: "$_id", avgRating: { $round: ["$avgRating", 2] }, totalReviews: 1 } },                                                             
        { $sort: { avgRating: -1, totalReviews: -1 } },                                                                                                                     
        { $limit: 5 }                                                                                                                                                       
    ]);                                                                                                                                                                     
                                                                                                                                                                            
    // 3. Keyword complaint search                                                                                                                                          
    db.reviews.find({ $text: { $search: "delay breakdown" } }, { score: { $meta: "textScore" }, _id: 0, comment: 1, rating: 1 }).sort({ score: { $meta: "textScore" } });   
                                                                                                                                                                            
    // 4. Vehicle compliance documents and trip media                                                                                                                       
    db.vehicle_documents.find({ vehicleId: 1 }, { _id: 0, vehicleId: 1, registration: 1, documents: 1, images: 1 });                                                        
    db.trip_media.find({ tripId: 1 }, { _id: 0, tripId: 1, mediaType: 1, caption: 1, url: 1 });                                                                             

This cheat sheet matches the exact requirements in ALLmems/DM2 CW -1 (1).pdf.pdf) and is saved in SmartMove_Live_Viva_Demonstration_Training_Guide.md. 