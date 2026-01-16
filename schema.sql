
-- VeloGO Production Schema
-- Optimized for PostgreSQL

-- Roles: 'RIDER', 'DRIVER', 'ADMIN'
CREATE TYPE user_role AS ENUM ('RIDER', 'DRIVER', 'ADMIN');
CREATE TYPE trip_status AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE lighting_status AS ENUM ('OPTIMAL', 'DIM', 'MAINTENANCE');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'RIDER',
    stripe_customer_id TEXT,
    avatar_url TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    trips_count INTEGER DEFAULT 0,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location_name TEXT NOT NULL,
    coordinates POINT, -- (Lat, Lng)
    security_on_site BOOLEAN DEFAULT TRUE,
    lighting_status lighting_status DEFAULT 'OPTIMAL',
    last_inspected TIMESTAMP WITH TIME ZONE
);

CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rider_id UUID REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT NOT NULL,
    pickup_coords POINT,
    dropoff_coords POINT,
    fare DECIMAL(10,2) NOT NULL,
    status trip_status DEFAULT 'PENDING',
    start_code TEXT NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    is_long_route BOOLEAN DEFAULT FALSE,
    pickup_hub_id UUID REFERENCES hubs(id),
    dropoff_hub_id UUID REFERENCES hubs(id),
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE safety_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id),
    user_id UUID REFERENCES users(id),
    issue_type TEXT NOT NULL, -- 'RED_FLAG', 'AI_FLAGGED'
    description TEXT,
    status TEXT DEFAULT 'OPEN', -- 'OPEN', 'RESOLVED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
