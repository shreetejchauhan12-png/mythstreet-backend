BEGIN;

-- =========================================================
-- TABLE: asset_types
-- =========================================================

CREATE TABLE IF NOT EXISTS asset_types (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    code VARCHAR(20) NOT NULL UNIQUE,

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =========================================================
-- TABLE: asset_purposes
-- =========================================================

CREATE TABLE IF NOT EXISTS asset_purposes (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    code VARCHAR(20) NOT NULL UNIQUE,

    description TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


-- =========================================================
-- TABLE: colors
-- =========================================================

CREATE TABLE IF NOT EXISTS colors (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    slug VARCHAR(120) NOT NULL UNIQUE,

    code VARCHAR(20) NOT NULL UNIQUE,

    hex_code VARCHAR(20),

    display_order INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =========================================================
-- TABLE: image_types
-- =========================================================

CREATE TABLE IF NOT EXISTS image_types (

    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE,

    slug VARCHAR(120) NOT NULL UNIQUE,

    code VARCHAR(20) NOT NULL UNIQUE,

    display_order INTEGER DEFAULT 0,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- =========================================================
-- TABLE: product_assets
-- =========================================================

CREATE TABLE IF NOT EXISTS product_assets (

    id SERIAL PRIMARY KEY,

    product_variant_id INTEGER NOT NULL,

    garment_type_id INTEGER NOT NULL,

    color_id INTEGER NOT NULL,

    image_type_id INTEGER NOT NULL,

    asset_type_id INTEGER NOT NULL,

    asset_purpose_id INTEGER NOT NULL,

    file_name VARCHAR(255) NOT NULL UNIQUE,

file_extension VARCHAR(20) NOT NULL,

sequence_number INTEGER NOT NULL,

original_name VARCHAR(255),

file_url TEXT NOT NULL,

    mime_type VARCHAR(100),

    file_size BIGINT,

    width INTEGER,

    height INTEGER,

    duration INTEGER,

    alt_text TEXT,

    display_order INTEGER DEFAULT 0,

    is_primary BOOLEAN DEFAULT FALSE,

    metadata JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_assets_variant
        FOREIGN KEY (product_variant_id)
        REFERENCES product_variants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_product_assets_garment_type
    FOREIGN KEY (garment_type_id)
    REFERENCES garment_types(id),

    CONSTRAINT fk_product_assets_color
        FOREIGN KEY (color_id)
        REFERENCES colors(id),

    CONSTRAINT fk_product_assets_image_type
        FOREIGN KEY (image_type_id)
        REFERENCES image_types(id),

    CONSTRAINT fk_product_assets_type
        FOREIGN KEY (asset_type_id)
        REFERENCES asset_types(id),

    CONSTRAINT fk_product_assets_purpose
        FOREIGN KEY (asset_purpose_id)
        REFERENCES asset_purposes(id)

);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_assets_variant
ON product_assets(product_variant_id);

CREATE INDEX IF NOT EXISTS idx_assets_garment_type
ON product_assets(garment_type_id);

CREATE INDEX IF NOT EXISTS idx_assets_color
ON product_assets(color_id);

CREATE INDEX IF NOT EXISTS idx_assets_image_type
ON product_assets(image_type_id);

CREATE INDEX IF NOT EXISTS idx_assets_type
ON product_assets(asset_type_id);

CREATE INDEX IF NOT EXISTS idx_assets_purpose
ON product_assets(asset_purpose_id);

CREATE INDEX IF NOT EXISTS idx_assets_primary
ON product_assets(is_primary);

CREATE INDEX IF NOT EXISTS idx_assets_display_order
ON product_assets(display_order);

COMMIT;