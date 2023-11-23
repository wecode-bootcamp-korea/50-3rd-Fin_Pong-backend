-- migrate:up
CREATE TABLE fixed_money_flows (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flow_type_id INT NOT NULL,
    category_id INT NOT NULL,
    memo VARCHAR(50),
    amount INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    date INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(flow_type_id) REFERENCES flow_type(id)
);

-- migrate:down
DROP TABLE fixed_money_flows;
