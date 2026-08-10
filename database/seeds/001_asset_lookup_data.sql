BEGIN;

-- =========================================================
-- GARMENTS
-- =========================================================

INSERT INTO garments (name, slug, code, display_order)
VALUES
('Oversized T-Shirt', 'oversized-tshirt', 'os', 1),
('T-Shirt', 't-shirt', 'ts', 2),
('Hoodie', 'hoodie', 'hd', 3),
('Sweatshirt', 'sweatshirt', 'sw', 4)
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- COLORS
-- =========================================================

INSERT INTO colors (name, slug, code, hex_code, display_order)
VALUES
('Black', 'black', 'bk', '#000000', 1),
('White', 'white', 'wh', '#FFFFFF', 2),
('Maroon', 'maroon', 'mr', '#680000', 3)
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- IMAGE TYPES
-- =========================================================

INSERT INTO image_types (name, slug, code, display_order)
VALUES
('Main Image', 'main-image', 'mg', 1),
('Gallery 2', 'gallery-2', 'g2', 2),
('Gallery 3', 'gallery-3', 'g3', 3),
('Gallery 4', 'gallery-4', 'g4', 4),
('Gallery 5', 'gallery-5', 'g5', 5),
('Gallery 6', 'gallery-6', 'g6', 6),
('Banner', 'banner', 'bn', 7)
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- ASSET TYPES
-- =========================================================

INSERT INTO asset_types (name, code, description)
VALUES
('Image', 'img', 'Product image'),
('Video', 'vid', 'Product video'),
('360 View', '360', '360 degree asset')
ON CONFLICT (code) DO NOTHING;

-- =========================================================
-- ASSET PURPOSES
-- =========================================================

INSERT INTO asset_purposes (name, code, description)
VALUES
('Product', 'product', 'Product asset'),
('Marketing', 'marketing', 'Marketing asset'),
('Banner', 'banner', 'Homepage banner')
ON CONFLICT (code) DO NOTHING;

COMMIT;