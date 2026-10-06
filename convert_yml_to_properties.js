const fs = require('fs');
const path = require('path');

const basePath = path.join('C:', 'Users', 'SANDANIMNE', 'Desktop', 'code ss', 'SmartMove', 'SmartMove', 'services');

const services = [
  { name: 'service-registry', port: 8761, type: 'eureka' },
  { name: 'api-gateway', port: 8080, type: 'gateway' },
  { name: 'auth-service', port: 8081, type: 'oracle-auth' },
  { name: 'vehicle-service', port: 8082, type: 'oracle' },
  { name: 'driver-service', port: 8083, type: 'oracle' },
  { name: 'route-service', port: 8084, type: 'oracle' },
  { name: 'passenger-service', port: 8085, type: 'oracle' },
  { name: 'trip-service', port: 8086, type: 'oracle' },
  { name: 'booking-service', port: 8087, type: 'oracle' },
  { name: 'payment-service', port: 8088, type: 'oracle' },
  { name: 'maintenance-service', port: 8089, type: 'oracle' },
  { name: 'feedback-service', port: 8090, type: 'oracle' },
  { name: 'content-service', port: 8091, type: 'mongo' },
  { name: 'report-service', port: 8092, type: 'oracle' },
];

function getProperties(serviceName, port, type) {
  if (type === 'eureka') {
    return `server.port=${port}
spring.application.name=${serviceName}
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.server.enable-self-preservation=false
`;
  } else if (type === 'gateway') {
    return `server.port=${port}
spring.application.name=${serviceName}

spring.cloud.gateway.routes[0].id=auth-service
spring.cloud.gateway.routes[0].uri=lb://auth-service
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/auth/**

spring.cloud.gateway.routes[1].id=vehicle-service
spring.cloud.gateway.routes[1].uri=lb://vehicle-service
spring.cloud.gateway.routes[1].predicates[0]=Path=/api/vehicles/**

spring.cloud.gateway.routes[2].id=driver-service
spring.cloud.gateway.routes[2].uri=lb://driver-service
spring.cloud.gateway.routes[2].predicates[0]=Path=/api/drivers/**

spring.cloud.gateway.routes[3].id=route-service
spring.cloud.gateway.routes[3].uri=lb://route-service
spring.cloud.gateway.routes[3].predicates[0]=Path=/api/routes/**

spring.cloud.gateway.routes[4].id=passenger-service
spring.cloud.gateway.routes[4].uri=lb://passenger-service
spring.cloud.gateway.routes[4].predicates[0]=Path=/api/passengers/**

spring.cloud.gateway.routes[5].id=trip-service
spring.cloud.gateway.routes[5].uri=lb://trip-service
spring.cloud.gateway.routes[5].predicates[0]=Path=/api/trips/**

spring.cloud.gateway.routes[6].id=booking-service
spring.cloud.gateway.routes[6].uri=lb://booking-service
spring.cloud.gateway.routes[6].predicates[0]=Path=/api/bookings/**

spring.cloud.gateway.routes[7].id=payment-service
spring.cloud.gateway.routes[7].uri=lb://payment-service
spring.cloud.gateway.routes[7].predicates[0]=Path=/api/payments/**

spring.cloud.gateway.routes[8].id=maintenance-service
spring.cloud.gateway.routes[8].uri=lb://maintenance-service
spring.cloud.gateway.routes[8].predicates[0]=Path=/api/maintenance/**

spring.cloud.gateway.routes[9].id=feedback-service
spring.cloud.gateway.routes[9].uri=lb://feedback-service
spring.cloud.gateway.routes[9].predicates[0]=Path=/api/feedback/**

spring.cloud.gateway.routes[10].id=content-service
spring.cloud.gateway.routes[10].uri=lb://content-service
spring.cloud.gateway.routes[10].predicates[0]=Path=/api/reviews/**,/api/announcements/**,/api/documents/**,/api/media/**

spring.cloud.gateway.routes[11].id=report-service
spring.cloud.gateway.routes[11].uri=lb://report-service
spring.cloud.gateway.routes[11].predicates[0]=Path=/api/reports/**

spring.cloud.gateway.default-filters[0]=DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedOrigins=http://localhost:3000
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedMethods=*
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowedHeaders=*
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowCredentials=true

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
`;
  } else if (type === 'oracle' || type === 'oracle-auth') {
    return `server.port=${port}
spring.application.name=${serviceName}
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
spring.datasource.username=smartmove
spring.datasource.password=smartmove123
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.OracleDialect
spring.jpa.properties.hibernate.format_sql=true
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.prefer-ip-address=true
management.endpoints.web.exposure.include=health,info
`;
  } else if (type === 'mongo') {
    return `server.port=${port}
spring.application.name=${serviceName}
spring.data.mongodb.uri=mongodb://localhost:27017/smartmove
spring.data.mongodb.database=smartmove
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.instance.prefer-ip-address=true
management.endpoints.web.exposure.include=health,info
`;
  }
}

function getDevProperties(type) {
  if (type === 'oracle' || type === 'oracle-auth') {
    return `spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
spring.datasource.username=smartmove
spring.datasource.password=smartmove123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
`;
  } else if (type === 'mongo') {
    return `spring.data.mongodb.uri=mongodb://localhost:27017/smartmove
`;
  }
  return '';
}

function getTestProperties(type) {
  if (type === 'oracle' || type === 'oracle-auth') {
    return `spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
`;
  }
  return '';
}

services.forEach(svc => {
  const svcPath = path.join(basePath, svc.name);
  const resourcesPath = path.join(svcPath, 'src', 'main', 'resources');
  const testResourcesPath = path.join(svcPath, 'src', 'test', 'resources');

  // Delete .yml files
  const deleteIfExists = (file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  };

  deleteIfExists(path.join(resourcesPath, 'application.yml'));
  deleteIfExists(path.join(resourcesPath, 'application-dev.yml'));
  deleteIfExists(path.join(resourcesPath, 'application-prod.yml'));
  deleteIfExists(path.join(testResourcesPath, 'application-test.yml'));

  // Write .properties files
  fs.writeFileSync(path.join(resourcesPath, 'application.properties'), getProperties(svc.name, svc.port, svc.type));
  
  const devProps = getDevProperties(svc.type);
  if (devProps) {
    fs.writeFileSync(path.join(resourcesPath, 'application-dev.properties'), devProps);
  }
  
  const testProps = getTestProperties(svc.type);
  if (testProps) {
    fs.writeFileSync(path.join(testResourcesPath, 'application-test.properties'), testProps);
  }
});

console.log('Successfully converted all .yml files to .properties for all 12 microservices.');
