package com.arenova.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Automatically drops legacy unique constraints from MySQL tables (such as UK on bookings.slot_id)
 * that Hibernate's ddl-auto=update does not drop automatically.
 */
@Component
public class DatabaseCleanupRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseCleanupRunner.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseCleanupRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        // 1. Direct explicit drop of the exact Hibernate legacy index
        try {
            jdbcTemplate.execute("ALTER TABLE bookings DROP INDEX UK2dylwhyvs65ikad6w8h506c2m");
            log.info("Successfully dropped legacy unique index UK2dylwhyvs65ikad6w8h506c2m from table bookings.");
        } catch (Exception e) {
            log.info("Index UK2dylwhyvs65ikad6w8h506c2m check: {}", e.getMessage());
        }

        // 2. Query INFORMATION_SCHEMA to drop any other UNIQUE index on bookings(slot_id)
        try {
            String sql = "SELECT DISTINCT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS " +
                         "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' " +
                         "AND COLUMN_NAME = 'slot_id' AND NON_UNIQUE = 0";

            List<String> indexNames = jdbcTemplate.queryForList(sql, String.class);

            for (String indexName : indexNames) {
                if (indexName != null && !indexName.equalsIgnoreCase("PRIMARY")) {
                    try {
                        log.info("Dropping legacy unique index '{}' from table 'bookings'", indexName);
                        jdbcTemplate.execute("ALTER TABLE bookings DROP INDEX " + indexName);
                    } catch (Exception ex) {
                        log.warn("Could not drop index {}: {}", indexName, ex.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Notice: Database index search skipped: {}", e.getMessage());
        }
    }
}
