package com.nibm.smartmove;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import oracle.ucp.jdbc.PoolDataSourceFactory;
import oracle.ucp.jdbc.PoolDataSource;

public class UCPDataSource {
    private final static String DB_USER = "ADMIN";
    private final static String DB_PASSWORD = "Sandanimne@2007";
    private final static String CONNECT_STRING = "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.ap-hyderabad-1.oraclecloud.com))(connect_data=(service_name=g2712e992546d67_smartmove_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))";
    private final static String CONN_FACTORY_CLASS_NAME = "oracle.jdbc.replay.OracleConnectionPoolDataSourceImpl";
    private PoolDataSource poolDataSource;

    public UCPDataSource() throws SQLException {
        this.poolDataSource = PoolDataSourceFactory.getPoolDataSource();
        poolDataSource.setConnectionFactoryClassName(CONN_FACTORY_CLASS_NAME);
        poolDataSource.setURL("jdbc:oracle:thin:@" + CONNECT_STRING);
        poolDataSource.setUser(DB_USER);
        poolDataSource.setPassword(DB_PASSWORD);
        poolDataSource.setConnectionPoolName("JDBC_UCP_POOL");
    }

    public void testConnection() {
        try {
            try (Connection conn = poolDataSource.getConnection();
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery("SELECT 1 FROM DUAL")) {
                if (rs.next()) {
                    System.out.println("Oracle Connection is working! Query result: " + rs.getInt(1));
                }
            }
        } catch (SQLException e) {
            System.out.println("Could not connect to the database - SQLException occurred: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        try {
            UCPDataSource uds = new UCPDataSource();
            uds.testConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
