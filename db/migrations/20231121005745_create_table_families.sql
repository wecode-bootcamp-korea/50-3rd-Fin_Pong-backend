-- migrate:up
CREATE TABLE families (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    auth_code VARCHAR(256) NOT NULL UNIQUE
);

-- migrate:down
DROP table families;
