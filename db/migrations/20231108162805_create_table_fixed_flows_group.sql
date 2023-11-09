-- migrate:up
CREATE TABLE fixed_flows_group (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- migrate:down
DROP TABLE fixed_flows_group;
