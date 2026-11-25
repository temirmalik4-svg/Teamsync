-- TeamSync - SQL DDL (PostgreSQL / SQLite kompatibilní)
-- Databázové schéma pro správu fotbalového týmu

-- 1. TÝMY A UŽIVATELÉ
CREATE TABLE teams (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    jersey_number INTEGER,
    position VARCHAR(10) CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
    role VARCHAR(20) NOT NULL DEFAULT 'PLAYER' CHECK (role IN ('COACH', 'CAPTAIN', 'PLAYER')),
    phone VARCHAR(30),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_team ON users(team_id);

-- 2. UDÁLOSTI (TRÉNINKY A ZÁPASY)
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('TRAINING', 'MATCH')),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(150) NOT NULL,
    is_home BOOLEAN DEFAULT TRUE,
    opponent VARCHAR(100),
    meet_time TIMESTAMP,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    is_finished BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_events_team_start ON events(team_id, start_time);

-- 3. DOCHÁZKA A OMLUVENKY
CREATE TABLE attendances (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PRESENT', 'EXCUSED', 'UNEXCUSED', 'PENDING')),
    reason TEXT,
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_event_user UNIQUE (event_id, user_id)
);
CREATE INDEX idx_attendances_user_status ON attendances(user_id, status);

-- 4. ZÁPASOVÁ SESTAVA A ROZESTAVENÍ
CREATE TABLE match_lineups (
    id VARCHAR(36) PRIMARY KEY,
    event_id VARCHAR(36) UNIQUE NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    formation VARCHAR(20) DEFAULT '4-4-2',
    tactical_notes TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lineup_slots (
    id VARCHAR(36) PRIMARY KEY,
    lineup_id VARCHAR(36) NOT NULL REFERENCES match_lineups(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    position_name VARCHAR(20) NOT NULL, -- GK, LB, CB, RB, CM, LM, RM, ST, SUB
    grid_x REAL NOT NULL, -- 0 až 100% šířka hřiště
    grid_y REAL NOT NULL, -- 0 až 100% výška hřiště
    is_starter BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0
);
CREATE INDEX idx_lineup_slots_lineup ON lineup_slots(lineup_id);
CREATE INDEX idx_lineup_slots_user ON lineup_slots(user_id);

-- 5. POKUTOVÝ SAZEBNÍK A KASA KABINY
CREATE TABLE fine_rules (
    id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    amount INTEGER NOT NULL CHECK (amount >= 0),
    category VARCHAR(50) DEFAULT 'DISCIPLINE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_fine_rules_team ON fine_rules(team_id);

CREATE TABLE fine_entries (
    id VARCHAR(36) PRIMARY KEY,
    team_id VARCHAR(36) NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    fine_rule_id VARCHAR(36) REFERENCES fine_rules(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    amount INTEGER NOT NULL CHECK (amount >= 0),
    is_paid BOOLEAN DEFAULT FALSE,
    issued_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    note TEXT
);
CREATE INDEX idx_fines_team_paid ON fine_entries(team_id, is_paid);
CREATE INDEX idx_fines_user_paid ON fine_entries(user_id, is_paid);
