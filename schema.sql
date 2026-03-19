
-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    password TEXT,
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- APPLICATIONS
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- CLIENTS
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150)
);

-- TICKETS
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_no VARCHAR(50),
    application_id INT REFERENCES applications(id),
    client_id INT REFERENCES clients(id),
    type VARCHAR(50),
    title TEXT,
    description TEXT,
    priority VARCHAR(20),
    status VARCHAR(50),
    assigned_to INT REFERENCES users(id),
    created_by INT REFERENCES users(id),
    response_time TIMESTAMP,
    resolution_time TIMESTAMP,
    sla_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- TICKET LOGS
CREATE TABLE ticket_logs (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id),
    comment TEXT,
    status VARCHAR(50),
    updated_by INT REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ATTACHMENTS
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(id),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_ticket_status ON tickets(status);
CREATE INDEX idx_ticket_app ON tickets(application_id);
CREATE INDEX idx_ticket_client ON tickets(client_id);
CREATE INDEX idx_ticket_assigned ON tickets(assigned_to);
