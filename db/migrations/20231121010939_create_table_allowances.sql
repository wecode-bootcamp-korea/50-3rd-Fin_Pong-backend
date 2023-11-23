-- migrate:up
CREATE TABLE allowances (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    created_at timestamp not null default now(),
    updated_at timestamp null on update current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users (id),
    UNIQUE KEY unique_allowances_entry (user_id, year, month)
);

-- migrate:down
DROP TABLE allowances;
