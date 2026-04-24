CREATE TABLE budget (
id INTEGER PRIMARY KEY CHECK (id = 1),
total_amount NUMERIC (12,2) NOT NULL CHECK (total_amount >= 0)
);

CREATE TABLE envelopes (
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name VARCHAR(100) NOT NULL,
envelope_amount NUMERIC (12, 2) NOT NULL CHECK (envelope_amount >= 0)
);

CREATE TABLE transactions (
id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
payment_amount NUMERIC (12,2) NOT NULL CHECK (payment_amount > 0),
payment_recipient VARCHAR (100) NOT NULL,
payment_date DATE NOT NULL,
id_envelope INT NOT NULL REFERENCES envelopes (id)
);