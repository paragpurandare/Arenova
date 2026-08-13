CREATE DATABASE IF NOT EXISTS arenova_slot_db;
CREATE DATABASE IF NOT EXISTS arenova_rental_DB;
CREATE DATABASE IF NOT EXISTS arenova_payment_DB;
CREATE DATABASE IF NOT EXISTS arenova_booking_DB;
CREATE DATABASE IF NOT EXISTS arenovaDB;

GRANT ALL PRIVILEGES ON arenova_slot_db.* TO 'parag'@'%';
GRANT ALL PRIVILEGES ON arenova_rental_DB.* TO 'parag'@'%';
GRANT ALL PRIVILEGES ON arenova_payment_DB.* TO 'parag'@'%';
GRANT ALL PRIVILEGES ON arenova_booking_DB.* TO 'parag'@'%';
GRANT ALL PRIVILEGES ON arenovaDB.* TO 'parag'@'%';

FLUSH PRIVILEGES;
