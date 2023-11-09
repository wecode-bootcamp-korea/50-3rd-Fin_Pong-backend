-- migrate:up
CREATE TABLE users_families (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    family_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (family_id) REFERENCES families (id),
    FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- migrate:down
DROP TABLE users_families;
