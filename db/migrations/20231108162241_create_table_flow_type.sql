-- migrate:up
CREATE TABLE flow_type (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(50) NOT NULL
);

-- migrate:down
DROP TABLE flow_type;
