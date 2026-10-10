import os

repo_path = r'E:\University\Higher National Diploma in Software Engineering\DM 2\SmartMove\services\trip-service\src\main\java\com\nibm\smartmove\tripservice\repository\TripRepository.java'
svc_path = r'E:\University\Higher National Diploma in Software Engineering\DM 2\SmartMove\services\trip-service\src\main\java\com\nibm\smartmove\tripservice\service\TripService.java'

with open(repo_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the query and signature
search1 = "SELECT t.* FROM TRIP t JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID WHERE (:origin IS NULL OR LOWER(r.ORIGIN) LIKE LOWER(CONCAT('%', :origin, '%'))) AND (:destination IS NULL OR LOWER(r.DESTINATION) LIKE LOWER(CONCAT('%', :destination, '%'))) AND (:maxPrice IS NULL OR r.BASE_FARE <= :maxPrice)"
replace1 = "SELECT t.* FROM TRIP t JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID WHERE (:origin IS NULL OR LOWER(r.ORIGIN) LIKE LOWER(CONCAT('%', :origin, '%'))) AND (:destination IS NULL OR LOWER(r.DESTINATION) LIKE LOWER(CONCAT('%', :destination, '%'))) AND (:maxPrice IS NULL OR r.BASE_FARE <= :maxPrice) AND (:date IS NULL OR TO_CHAR(t.DEPARTURE_TIME, 'YYYY-MM-DD') = :date)"
content = content.replace(search1, replace1)

search2 = 'List<Trip> search(@Param("origin") String origin, @Param("destination") String destination, @Param("maxPrice") Double maxPrice);'
replace2 = 'List<Trip> search(@Param("origin") String origin, @Param("destination") String destination, @Param("date") String date, @Param("maxPrice") Double maxPrice);'
content = content.replace(search2, replace2)

with open(repo_path, 'w', encoding='utf-8') as f:
    f.write(content)

with open(svc_path, 'r', encoding='utf-8') as f:
    svc_content = f.read()

svc_content = svc_content.replace('return repository.search(origin, destination, maxPrice);', 'return repository.search(origin, destination, date, maxPrice);')

with open(svc_path, 'w', encoding='utf-8') as f:
    f.write(svc_content)

print('Fixed Trip date')
