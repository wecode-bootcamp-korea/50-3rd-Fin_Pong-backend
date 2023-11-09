-- migrate:up
CREATE TABLE money_flows (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    flow_type_id INT NOT NULL,
    memo VARCHAR(50) NULL,
    price INT NOT NULL,
    user_id INT NOT NULL,
    date DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_At TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (flow_type_id) REFERENCES flow_type (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down
DROP TABLE money_flows;
