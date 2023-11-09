-- migrate:up
CREATE TABLE middle_fixed_flows (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fixed_flow_id INT NOT NULL,
    fixed_flow_group_id INT NOT NULL,
    FOREIGN KEY (fixed_flow_id) REFERENCES fixed_flows(id),
    FOREIGN KEY (fixed_flow_id) REFERENCES fixed_flows(id)
);

-- migrate:down
DROP TABLE middle_fixed_flows;
