-- Create database if not exists (PostgreSQL doesn't support IF NOT EXISTS for CREATE DATABASE)
-- Database is already created by POSTGRES_DB environment variable

-- Connect to the database
\c tododb;

-- TypeORM synchronize가 테이블을 자동으로 생성하므로 여기서는 생성하지 않음
-- 샘플 데이터는 TypeORM이 테이블을 생성한 후 백엔드에서 삽입하거나
-- 또는 별도의 마이그레이션 스크립트로 처리
