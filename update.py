import os

base = r'E:\University\Higher National Diploma in Software Engineering\DM 2\SmartMove'

def replace_in_file(path, search, replace):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if search in content:
        content = content.replace(search, replace)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated', path)
    else:
        print('Could not find text in', path)

# 1. VEHICLE
repo = os.path.join(base, r'services\vehicle-service\src\main\java\com\nibm\smartmove\vehicleservice\repository\VehicleRepository.java')
svc = os.path.join(base, r'services\vehicle-service\src\main\java\com\nibm\smartmove\vehicleservice\service\VehicleService.java')
ctrl = os.path.join(base, r'services\vehicle-service\src\main\java\com\nibm\smartmove\vehicleservice\controller\VehicleController.java')

replace_in_file(repo, 
'public interface VehicleRepository extends JpaRepository<Vehicle, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(v.type) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(v.model) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Vehicle> search(@Param("q") String q);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Vehicle> search(String q) { return repository.search(q); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/vehicles/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/vehicles/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }''')


# 2. DRIVER
repo = os.path.join(base, r'services\driver-service\src\main\java\com\nibm\smartmove\driverservice\repository\DriverRepository.java')
svc = os.path.join(base, r'services\driver-service\src\main\java\com\nibm\smartmove\driverservice\service\DriverService.java')
ctrl = os.path.join(base, r'services\driver-service\src\main\java\com\nibm\smartmove\driverservice\controller\DriverController.java')

replace_in_file(repo, 
'public interface DriverRepository extends JpaRepository<Driver, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface DriverRepository extends JpaRepository<Driver, Long> {
    @Query("SELECT d FROM Driver d WHERE LOWER(d.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.licenseNumber) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(d.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Driver> search(@Param("q") String q);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Driver> search(String q) { return repository.search(q); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/drivers/search")
    public org.springframework.http.ResponseEntity<?> endpoint7(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/drivers/search")
    public org.springframework.http.ResponseEntity<?> endpoint7(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }''')


# 3. ROUTE
repo = os.path.join(base, r'services\route-service\src\main\java\com\nibm\smartmove\routeservice\repository\RouteRepository.java')
svc = os.path.join(base, r'services\route-service\src\main\java\com\nibm\smartmove\routeservice\service\RouteService.java')
ctrl = os.path.join(base, r'services\route-service\src\main\java\com\nibm\smartmove\routeservice\controller\RouteController.java')

replace_in_file(repo, 
'public interface RouteRepository extends JpaRepository<Route, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface RouteRepository extends JpaRepository<Route, Long> {
    @Query("SELECT r FROM Route r WHERE LOWER(r.origin) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(r.destination) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Route> search(@Param("q") String q);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Route> search(String q) { return repository.search(q); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/routes/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/routes/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }''')


# 4. PASSENGER
repo = os.path.join(base, r'services\passenger-service\src\main\java\com\nibm\smartmove\passengerservice\repository\PassengerRepository.java')
svc = os.path.join(base, r'services\passenger-service\src\main\java\com\nibm\smartmove\passengerservice\service\PassengerService.java')
ctrl = os.path.join(base, r'services\passenger-service\src\main\java\com\nibm\smartmove\passengerservice\controller\PassengerController.java')

replace_in_file(repo, 
'public interface PassengerRepository extends JpaRepository<Passenger, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    @Query("SELECT p FROM Passenger p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.email) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.phone) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Passenger> search(@Param("q") String q);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Passenger> search(String q) { return repository.search(q); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/passengers/search")
    public org.springframework.http.ResponseEntity<?> endpoint6(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/passengers/search")
    public org.springframework.http.ResponseEntity<?> endpoint6(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }''')


# 5. TRIP
repo = os.path.join(base, r'services\trip-service\src\main\java\com\nibm\smartmove\tripservice\repository\TripRepository.java')
svc = os.path.join(base, r'services\trip-service\src\main\java\com\nibm\smartmove\tripservice\service\TripService.java')
ctrl = os.path.join(base, r'services\trip-service\src\main\java\com\nibm\smartmove\tripservice\controller\TripController.java')

# For trip, query by native query with join on Route.
replace_in_file(repo, 
'public interface TripRepository extends JpaRepository<Trip, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface TripRepository extends JpaRepository<Trip, Long> {
    @Query(value = "SELECT t.* FROM TRIP t JOIN ROUTE r ON t.ROUTE_ID = r.ROUTE_ID WHERE (:origin IS NULL OR LOWER(r.ORIGIN) LIKE LOWER(CONCAT('%', :origin, '%'))) AND (:destination IS NULL OR LOWER(r.DESTINATION) LIKE LOWER(CONCAT('%', :destination, '%'))) AND (:maxPrice IS NULL OR r.BASE_FARE <= :maxPrice)", nativeQuery = true)
    List<Trip> search(@Param("origin") String origin, @Param("destination") String destination, @Param("maxPrice") Double maxPrice);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Trip> search(String origin, String destination, String date, Double maxPrice) { return repository.search(origin, destination, maxPrice); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/trips/search")
    public org.springframework.http.ResponseEntity<?> endpoint5() {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/trips/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Double maxPrice) {
        return org.springframework.http.ResponseEntity.ok(service.search(origin, destination, date, maxPrice));
    }''')


# 6. BOOKING
repo = os.path.join(base, r'services\booking-service\src\main\java\com\nibm\smartmove\bookingservice\repository\BookingRepository.java')
svc = os.path.join(base, r'services\booking-service\src\main\java\com\nibm\smartmove\bookingservice\service\BookingService.java')
ctrl = os.path.join(base, r'services\booking-service\src\main\java\com\nibm\smartmove\bookingservice\controller\BookingController.java')

# Booking: booking status or passengerId.
replace_in_file(repo, 
'public interface BookingRepository extends JpaRepository<Booking, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b WHERE LOWER(b.status) LIKE LOWER(CONCAT('%', :q, '%')) OR CAST(b.passengerId AS string) LIKE CONCAT('%', :q, '%')")
    List<Booking> search(@Param("q") String q);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Booking> search(String q) { return repository.search(q); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/bookings/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/bookings/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }''')

# 7. MAINTENANCE
repo = os.path.join(base, r'services\maintenance-service\src\main\java\com\nibm\smartmove\maintenanceservice\repository\MaintenanceRepository.java')
svc = os.path.join(base, r'services\maintenance-service\src\main\java\com\nibm\smartmove\maintenanceservice\service\MaintenanceService.java')
ctrl = os.path.join(base, r'services\maintenance-service\src\main\java\com\nibm\smartmove\maintenanceservice\controller\MaintenanceController.java')

# Maintenance: type or technician. Wait, wait, Maintenance doesn't have type or technician! Let's check entity. 
# "MaintenanceController (/api/maintenance/search?q={query}): search by type or technician."
# But the entity had: `description`, `cost`, `maintenanceDate`, `status`. There is no `type` or `technician` field in my output of `Maintenance.java`.
# Let's search by description (for technician) and status (for type). Or I'll just check `description` for both.
replace_in_file(repo, 
'public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    @Query("SELECT m FROM Maintenance m WHERE LOWER(m.description) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Maintenance> search(@Param("q") String q);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Maintenance> search(String q) { return repository.search(q); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/maintenance/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/maintenance/search")
    public org.springframework.http.ResponseEntity<?> endpoint5(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }''')


# 8. FEEDBACK
repo = os.path.join(base, r'services\feedback-service\src\main\java\com\nibm\smartmove\feedbackservice\repository\FeedbackRepository.java')
svc = os.path.join(base, r'services\feedback-service\src\main\java\com\nibm\smartmove\feedbackservice\service\FeedbackService.java')
ctrl = os.path.join(base, r'services\feedback-service\src\main\java\com\nibm\smartmove\feedbackservice\controller\FeedbackController.java')

replace_in_file(repo, 
'public interface FeedbackRepository extends JpaRepository<Feedback, Long> {',
'''import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    @Query("SELECT f FROM Feedback f WHERE LOWER(f.description) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(f.type) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Feedback> search(@Param("q") String q);''')

replace_in_file(svc,
'public void deleteById(Long id) { repository.deleteById(id); }',
'''public void deleteById(Long id) { repository.deleteById(id); }
    public List<Feedback> search(String q) { return repository.search(q); }''')

replace_in_file(ctrl,
'''    @GetMapping("/api/feedback/search")
    public org.springframework.http.ResponseEntity<?> endpoint4(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok().build();
    }''',
'''    @GetMapping("/api/feedback/search")
    public org.springframework.http.ResponseEntity<?> endpoint4(@RequestParam String q) {
        return org.springframework.http.ResponseEntity.ok(service.search(q));
    }''')
