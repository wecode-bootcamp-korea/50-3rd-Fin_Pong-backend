-- migrate:up
CREATE TABLE middle_fixed_money_flows (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fixed_money_flow_id INT NOT NULL,
    fixed_money_flow_group_id INT NOT NULL,
    FOREIGN KEY (fixed_money_flow_id) REFERENCES fixed_money_flows(id),
    FOREIGN KEY(fixed_money_flow_group_id) REFERENCES fixed_money_flows_group(id)
);

-- migrate:down
DROP TABLE middle_fixed_money_flows;
