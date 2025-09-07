-- SQL schema for Halal Product Finder AU

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','moderator','admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barcode TEXT UNIQUE NOT NULL,
  name TEXT,
  brand TEXT,
  img_url TEXT,
  off_payload_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Halal assessments table
CREATE TABLE IF NOT EXISTS halal_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('halal','likely_halal','unknown','not_halal')),
  confidence INTEGER NOT NULL DEFAULT 0,
  reasons JSONB,
  sources JSONB,
  reviewer_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  chain TEXT CHECK (chain IN ('coles','woolworths','aldi','iga','costco','other')),
  suburb TEXT,
  state TEXT
);

-- Product-store association table
CREATE TABLE IF NOT EXISTS product_store (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  note TEXT,
  PRIMARY KEY (product_id, store_id)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('evidence','correction','request_review')),
  text TEXT,
  photo_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);