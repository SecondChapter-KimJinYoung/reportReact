-- Create database if not exists (PostgreSQL doesn't support IF NOT EXISTS for CREATE DATABASE)
-- Database is already created by POSTGRES_DB environment variable

-- Connect to the database
\c tododb;

-- Create todos table (TypeORM will handle this, but this is a backup)
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO todos (title, completed) VALUES
    ('Docker Compose 설정하기', true),
    ('프론트엔드 개발', false),
    ('백엔드 API 개발', false),
    ('데이터베이스 연결', false);
