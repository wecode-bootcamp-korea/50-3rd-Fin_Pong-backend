-- migrate:up
CREATE TABLE fixed_flows (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fixed_flow_type_id INT NOT NULL,
    fixed_flow_category_id INT NOT NULL,
    fixed_flow_memo VARCHAR(50),
    fixed_flow_amount INT NOT NULL,
    fixed_flow_date DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (fixed_flow_category_id) REFERENCES categories (id)
);

-- migrate:down
DROP TABLE fixed_flows;
