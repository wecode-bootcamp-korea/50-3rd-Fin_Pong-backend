-- migrate:up
CREATE TABLE budget (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    family_id INT NOT NULL,
    budget INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (family_id) REFERENCES families (id)
);

-- migrate:down
DROP TABLE budget;
