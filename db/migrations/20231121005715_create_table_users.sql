-- migrate:up
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    birthdate TIMESTAMP NULL,
    phone_number VARCHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- migrate:down
DROP TABLE users;
