-- Shopify CSV → Supabase import
--
-- VERIFY THESE ID ASSUMPTIONS BEFORE RUNNING:
--   product_categories: 1=Rings, 2=Necklaces/Pendants, 3=Earrings, 4=Pins/Brooches
--   size_charts:        1=Ring Sizes, 2=Necklace, 3=Earring, 4=Pin
--   metal_types:        1=Sterling Silver, 2=Bronze
--
-- Images use Shopify CDN URLs (image_path/thumbnail fields left empty).
-- Upload images to Supabase storage separately and update the rows.
--
-- Earring material variants use size_value='one-size' — update if your schema differs.
-- Products not in standard categories (home decor, apparel, stickers) use empty arrays.

DO $$
DECLARE
  p_id BIGINT;
BEGIN

-- ============================================================
-- RINGS  (product_categories=[1], size_chart=[1])
-- ============================================================

  -- Multi-Skull Ring
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Multi-Skull Ring', 60, 'Multi-Skull ring available in both solid Bronze and Sterling silver, perfect for adding a unique touch to your jewelry collection. This exquisite piece combines durability with style, making it a must-have for every fashion enthusiast.As time passes and with regular use, bronze and silver jewelry may acquire a natural patina or tarnish. Nevertheless, it can be cleaned and polished to bring back its original shiny look.', true, ARRAY[1], ARRAY[1], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,1,'7',   1,0),(p_id,1,'7-5', 1,0),(p_id,1,'8',   1,1),(p_id,1,'8-5', 1,0),(p_id,1,'9',   1,0),
  (p_id,1,'9-5', 1,0),(p_id,1,'10',  1,0),(p_id,1,'10-5',1,0),(p_id,1,'11',  1,1),(p_id,1,'11-5',1,0),(p_id,1,'12',  1,0),
  (p_id,1,'7',   2,1),(p_id,1,'7-5', 2,1),(p_id,1,'8',   2,0),(p_id,1,'8-5', 2,0),(p_id,1,'9',   2,0),
  (p_id,1,'9-5', 2,0),(p_id,1,'10',  2,0),(p_id,1,'10-5',2,0),(p_id,1,'11',  2,2),(p_id,1,'11-5',2,0),(p_id,1,'12',  2,0);

  -- Full Faced Skull Ring
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Full Faced Skull Ring', 60, 'Bold and captivating, this bronze skull ring is expertly crafted to add an edgy touch to your style. Featuring intricate detailing and a metallic finish, it''s the perfect accessory for those who love unique and alternative fashion. Durable and comfortable, this ring promises to be a conversation starter wherever you go. Ideal for collectors and anyone looking to make a statement.As time passes and with regular use, bronze and silver jewelry may acquire a natural patina or tarnish. Nevertheless, it can be cleaned and polished to bring back its original shiny look.', true, ARRAY[1], ARRAY[1], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,1,'7',   2,1),(p_id,1,'7-5', 2,1),(p_id,1,'8',   2,0),(p_id,1,'8-5', 2,0),(p_id,1,'9',   2,1),
  (p_id,1,'9-5', 2,0),(p_id,1,'10',  2,0),(p_id,1,'10-5',2,0),(p_id,1,'11',  2,0),(p_id,1,'11-5',2,0),(p_id,1,'12',  2,0),
  (p_id,1,'7',   1,0),(p_id,1,'7-5', 1,0),(p_id,1,'8',   1,0),(p_id,1,'8-5', 1,0),(p_id,1,'9',   1,1),
  (p_id,1,'9-5', 1,0),(p_id,1,'10',  1,0),(p_id,1,'10-5',1,0),(p_id,1,'11',  1,0),(p_id,1,'11-5',1,0),(p_id,1,'12',  1,0);

  -- Skull With Vines
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Skull With Vines', 80, 'Make a striking statement with this handcrafted bronze and silver ring featuring a detailed skull entwined with vine motifs. Perfect for those who embrace unique, gothic-inspired accessories, this durable ring adds edgy style to any outfit. Ideal for collectors and individuals who appreciate bold, artistic jewelry.As time passes and with regular use, bronze and silver jewelry may acquire a natural patina or tarnish. Nevertheless, it can be cleaned and polished to bring back its original shiny look.', true, ARRAY[1], ARRAY[1], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,1,'9',   1,1),(p_id,1,'9-5', 1,2),(p_id,1,'10',  1,0),(p_id,1,'10-5',1,0),(p_id,1,'11',  1,0),
  (p_id,1,'11-5',1,0),(p_id,1,'12',  1,0),(p_id,1,'8-5', 1,0),(p_id,1,'8',   1,0),
  (p_id,1,'9',   2,1),(p_id,1,'9-5', 2,2),(p_id,1,'10',  2,0),(p_id,1,'10-5',2,0),(p_id,1,'11',  2,0),
  (p_id,1,'11-5',2,0),(p_id,1,'12',  2,0),(p_id,1,'8-5', 2,0),(p_id,1,'8',   2,0);

  -- Ankh Cross Ring
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Ankh Cross Ring', 60, 'Enhance your style with this beautifully crafted Bronze and Silver ring, featuring the iconic Ankh cross design. The polished finish and unique symbolism make it a standout accessory for both casual and formal occasions. Perfect as a gift or a meaningful addition to your jewelry collection.As time passes and with regular use, bronze and silver jewelry may acquire a natural patina or tarnish. Nevertheless, it can be cleaned and polished to bring back its original shiny look.', true, ARRAY[1], ARRAY[1], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,1,'5',  2,0),(p_id,1,'5-5',2,0),(p_id,1,'6',  2,5),(p_id,1,'6-5',2,1),(p_id,1,'7',  2,0),
  (p_id,1,'7-5',2,0),(p_id,1,'8',  2,0),(p_id,1,'8-5',2,0),(p_id,1,'9',  2,4),(p_id,1,'9-5',2,0),(p_id,1,'10', 2,0),
  (p_id,1,'5',  1,0),(p_id,1,'5-5',1,0),(p_id,1,'6',  1,0),(p_id,1,'6-5',1,0),(p_id,1,'7',  1,0),
  (p_id,1,'7-5',1,0),(p_id,1,'8',  1,0),(p_id,1,'8-5',1,0),(p_id,1,'9',  1,1),(p_id,1,'9-5',1,0),(p_id,1,'10', 1,0);

  -- Silver When Pigs Fly Ring
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Silver When Pigs Fly Ring', 80, 'Who says pigs can''t fly? Handcrafted in Silver, this whimsical ring turns imagination into wearable art. Perfect for dreamers, collectors, and anyone who loves jewelry with personality.As time passes and with regular use, bronze and silver jewelry may acquire a natural patina or tarnish. Nevertheless, it can be cleaned and polished to bring back its original shiny look.', true, ARRAY[1], ARRAY[1], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,1,'5',  1,0),(p_id,1,'5-5',1,0),(p_id,1,'6',  1,1),(p_id,1,'6-5',1,1),(p_id,1,'7',  1,0),
  (p_id,1,'7-5',1,0),(p_id,1,'8',  1,1),(p_id,1,'8-5',1,0),(p_id,1,'9',  1,0),
  (p_id,1,'5',  2,0),(p_id,1,'5-5',2,0),(p_id,1,'6',  2,0),(p_id,1,'6-5',2,0),(p_id,1,'7',  2,0),
  (p_id,1,'7-5',2,0),(p_id,1,'8',  2,1),(p_id,1,'8-5',2,0),(p_id,1,'9',  2,0);

  -- Half Skull Ring
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Half Skull Ring', 70, 'Make a bold statement with this antique skull ring. Crafted from durable bronze with a detailed skull design, this ring adds a touch of gothic elegance to any outfit. Perfect for collectors, bikers, or anyone looking to showcase their unique style. A striking accessory that never goes out of fashion.As time passes and with regular use, bronze and silver jewelry may acquire a natural patina or tarnish. Nevertheless, it can be cleaned and polished to bring back its original shiny look.', true, ARRAY[1], ARRAY[1], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,1,'5',  2,0),(p_id,1,'5-5', 2,1),(p_id,1,'6',   2,1),(p_id,1,'6-5', 2,2),(p_id,1,'7',   2,1),
  (p_id,1,'7-5', 2,0),(p_id,1,'8',   2,1),(p_id,1,'8-5', 2,4),(p_id,1,'9',   2,4),(p_id,1,'9-5', 2,0),
  (p_id,1,'10',  2,0),(p_id,1,'10-5',2,0),(p_id,1,'11',  2,1),(p_id,1,'11-5',2,1),(p_id,1,'12',  2,0),
  (p_id,1,'5',  1,0),(p_id,1,'5-5', 1,0),(p_id,1,'6',   1,0),(p_id,1,'6-5', 1,0),(p_id,1,'7',   1,0),
  (p_id,1,'7-5', 1,0),(p_id,1,'8',   1,0),(p_id,1,'8-5', 1,0),(p_id,1,'9',   1,0),(p_id,1,'9-5', 1,0),
  (p_id,1,'10',  1,0),(p_id,1,'10-5',1,1),(p_id,1,'11',  1,0),(p_id,1,'11-5',1,0),(p_id,1,'12',  1,0);

-- ============================================================
-- EARRINGS  (product_categories=[3], size_chart=[3])
-- Material-only variants use size_value='one-size'
-- ============================================================

  -- Ancient Coin Replica Earrings (no material variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Ancient Coin Replica Earrings', 80, 'These handcrafted earrings feature stunning replicas of ancient coins, adding a touch of history and elegance to your look. Perfect for lovers of vintage style and historical jewelry, these earrings offer a distinctive accessory that stands out. Crafted with durable alloy and detailed engravings, they''re lightweight and comfortable to wear all day.These are replicas of ancient coins minted in 40 BC, The AE PrutahThe bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Ancient Coin Dangle Earrings (no material variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Ancient Coin Dangle Earrings', 80, 'Enhance your style with these elegant Ancient Coin Dangle Earrings. Featuring detailed vintage-inspired coin charms, they add a classic and unique touch to any outfit. Crafted for comfort and designed to stand out, these lightweight earrings are perfect for both everyday wear and special occasions.These are replicas of ancient half shekels originally minted in 70 AD.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Hand-Shaped Silver Earrings (sterling + bronze variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Hand-Shaped Silver Earrings', 60, 'Make a bold statement with these hand-shaped silver earrings, crafted with intricate detail for a quirky and artistic touch to your outfit. Perfect for those who love unusual, elegant accessories and want to stand out. Lightweight and comfortable for everyday wear.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',1,1),(p_id,3,'one-size',2,1);

  -- Handcrafted Metal Church Key Earrings (no material variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Handcrafted Metal Church Key Earrings', 80, 'Add a touch of artisanal charm to your style with these handcrafted metal bar earrings. Each pair features a sleek, minimalist design, perfect for daily wear or special occasions. Lightweight and comfortable, these earrings are an ideal accessory for those who appreciate unique, handmade jewelry.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1/4 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Razor Blade Earrings (no material variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Razor Blade Earrings', 80, 'Add a bold statement to your look with these unique razor blade earrings. Crafted from high-quality metal, they offer a striking, rebellious aesthetic perfect for punk or alternative styles. Lightweight and comfortable to wear, these earrings are designed for those who embrace individuality.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Cicada Earrings (sterling + bronze variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Cicada Earrings', 60, 'Make a bold statement with these stunning Silver Cicada Earrings. Crafted with intricate detail, each earring captures the elegance and mystique of the cicada, perfect for nature lovers and those seeking a distinctive accessory. Lightweight, stylish, and hand-finished for a premium look.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',1,0),(p_id,3,'one-size',2,0);

  -- Coyote Jawbone Earrings (bronze + sterling variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Coyote Jawbone Earrings', 60, 'Make a bold statement with these unique metal jawbone earrings. Expertly crafted to resemble detailed jawbone shapes, these earrings add an edgy, artistic flair to any outfit. Perfect for fans of alternative fashion, gothic, or nature-inspired accessories. Lightweight and comfortable for all-day wear.These jaw bones are from 3D scans of a Coyote skull, scaled to size and printed. I then make molds for wax injection.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1.5 x 1/2 in size', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',2,0),(p_id,3,'one-size',1,1);

  -- Prickly Pear Cactus Earrings (sterling + bronze variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Prickly Pear Cactus Earrings', 60, 'Add a touch of southwestern charm to your style with these cactus-shaped earrings. Crafted from durable metal with intricate detailing, these earrings create a bold statement and are perfect for lovers of nature or boho accessories. Lightweight and easy to wear, they make a great gift for any occasion.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',1,1),(p_id,3,'one-size',2,1);

  -- Vertebrae Dangle Earrings (bronze + sterling variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Vertebrae Dangle Earrings', 60, 'Stand out with these striking vertebrae dangle earrings, crafted in metal for durability and style. Perfect for anatomy lovers, goth enthusiasts, or anyone who appreciates distinctive accessories. Comfortable hooks and attention to detail make these earrings a great gift or conversation starter.These vertebrae are from 3D scans of Deer bones, scaled to size and printed. I then make molds for wax injection.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1.75 x 1/2 in size', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',2,1),(p_id,3,'one-size',1,3);

  -- Saguaro Cactus Earrings (bronze + sterling variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Saguaro Cactus Earrings', 60, 'Add a touch of southwestern charm to your look with these cactus-shaped earrings. Crafted in both silver and bronze metal, they''re lightweight, stylish, and perfect for nature lovers or anyone seeking a playful accessory. Great for both casual wear and special occasions. The bronze earrings have gold-filled wire for ear hooks and the silver ones have sterling silver ear hooks.1 x 1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',2,1),(p_id,3,'one-size',1,1);

  -- Guillotine Dangle Earrings (bronze + sterling variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Guillotine Dangle Earrings', 60, 'Make a bold statement with these unique guillotine dangle earrings. Crafted from durable metal with an antique brass finish, these earrings blend vintage aesthetics with edgy design. Perfect for history lovers or anyone looking to add a dramatic flair to their outfit. Lightweight and comfortable for all-day wear.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',2,0),(p_id,3,'one-size',1,1);

  -- Stirrups (sterling + bronze variants)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Stirrups', 60, 'Solid silver and Bronze stirrups earrings. The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic.The silver earrings are on sterling silver ear hooks.They are 1 X 1/2 inch', true, ARRAY[3], ARRAY[3], ARRAY[1,2])
  RETURNING id INTO p_id;
  INSERT INTO product_variants (product_id, size_chart_id, size_value, metal_type_id, stock) VALUES
  (p_id,3,'one-size',1,2),(p_id,3,'one-size',2,1);

  -- Metal Moray Eel Earrings (no material variants in CSV)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Metal Moray Eel Earrings', 90, 'Add a bold touch to your style with these striking metal Eel earrings. Crafted from durable metal, each piece features a winding serpent pattern that catches the light for a dramatic effect. Perfect for those who love statement jewelry and want to stand out at any event. Lightweight and comfortable for all-day wear.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1/2 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Wrench Earrings (no material variants in CSV)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Wrench Earrings', 90, 'Show off your love for creativity and craftsmanship with these playful wrench earrings. Crafted from durable metal, each earring is designed to resemble a miniature adjustable wrench, making them perfect for mechanics, DIY enthusiasts, or anyone who appreciates quirky, statement accessories. Lightweight and comfortable for all-day wear.The bronze earrings rest on gold filled wire as ear hooks, which are hypoallergenic. The silver earrings are on sterling silver ear hooks.1 x 1/4 inch in size', true, ARRAY[3], ARRAY[3], ARRAY[]::integer[])
  RETURNING id INTO p_id;

-- ============================================================
-- NECKLACES & PENDANTS  (product_categories=[2], size_chart=[2])
-- ============================================================

  -- Ancient Roman Coin Pendant Necklace
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Ancient Roman Coin Pendant Necklace', 100, 'Elevate your style with this unique necklace featuring a pendant modeled after an ancient Roman coin. Carefully crafted to capture historical elegance, this accessory adds a distinctive touch to any outfit. Durable chain and detailed coin make it perfect for history enthusiasts or anyone seeking a sophisticated look.Taken from a direct mold of an Ancient Roman coin. Depicting Constantius II this coin was minted between 337-361 AD', true, ARRAY[2], ARRAY[2], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Silver Sea Turtle Pendant
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Silver Sea Turtle Pendant', 130, 'Showcase your love for the ocean with this beautifully crafted silver sea turtle pendant. Featuring intricate details and a sturdy chain, this necklace is perfect for nature enthusiasts or anyone looking to add a unique touch to their outfit. Durable, hypoallergenic, and suitable for everyday wear.', true, ARRAY[2], ARRAY[2], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Geometric Skull Mandala Pendant
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Geometric Skull Mandala Pendant', 130, 'Add a touch of elegance and mystique to your look with this Geometric Mandala Pendant. Crafted in lustrous silver-tone metal, the pendant features an intricate mandala-inspired pattern that exudes harmony and sophistication. Perfect for everyday wear or special occasions, this necklace is a stylish and meaningful accessory for any wardrobe.', true, ARRAY[2], ARRAY[2], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Silver Seashell Pendant
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Silver Seashell Pendant', 130, 'Bring a touch of the ocean to your style with this beautifully crafted silver seashell pendant necklace. Featuring intricate detailing and a durable silver-tone chain, it''s perfect for adding coastal charm to any outfit.This item is taken from a direct mold of a real seashell.', true, ARRAY[2], ARRAY[2], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Silver Art Nouveau Pendant
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Silver Art Nouveau Pendant', 100, 'Celebrate timeless elegance with this beautifully detailed Art Nouveau-inspired pendant necklace. The design features a serene woman''s face framed by flowing, organic lines that echo the signature curves and natural forms of the Art Nouveau style. Finished in antique silver, the pendant has a subtly aged look that enhances its artistic character and depth.', true, ARRAY[2], ARRAY[2], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Ancient Coin Pendant
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Ancient Coin Pendant', 100, 'This unique pendant necklace features a replica of an ancient coin, making it a striking piece that combines timeless history with modern style. The detailed coin design is paired with a sturdy silver chain, perfect for those who appreciate vintage aesthetics or collector''s jewelry.A direct mold from an ancient coin. The replica is of a half shekel from 66 AD', true, ARRAY[2], ARRAY[2], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Beaver Vertebrae Pendant
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Beaver Vertebrae Pendant', 40, 'Handcrafted pendant featuring an authentic beaver vertebra, polished and set in a durable metal bail. Each piece is unique, showcasing natural bone texture and subtle variations. Perfect for nature enthusiasts, collectors, and those drawn to wildlife-inspired jewelry. Lightweight and comfortable for everyday wear.', true, ARRAY[2], ARRAY[2], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Doves Claw Pendant (bronze only)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Doves Claw Pendant', 80, 'This intricately designed Dove Claw Pendant captures the mysterious allure of gothic and fantasy fashion. Made from durable solid Bronze metal, it serves as a unique statement piece for necklaces or keychains. Perfect accessory for anyone seeking an eye-catching addition to their jewelry collection.', true, ARRAY[2], ARRAY[2], ARRAY[2])
  RETURNING id INTO p_id;

  -- Dove Claw Pendant (second listing, bronze only)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Dove Claw Pendant', 90, 'This intricately designed Dove Claw Pendant captures the mysterious allure of gothic and fantasy fashion. Made from durable solid Bronze metal, it serves as a unique statement piece for necklaces or keychains. Perfect accessory for anyone seeking an eye-catching addition to their jewelry collection. Made from an exact mold of a real preserved Doves foot.', true, ARRAY[2], ARRAY[2], ARRAY[2])
  RETURNING id INTO p_id;

-- ============================================================
-- PINS & BROOCHES  (product_categories=[4], size_chart=[4])
-- ============================================================

  -- Bronze Mountain Goat Brooch
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Bronze Mountain Goat Brooch', 35, 'Capture the wild spirit of the mountains with this beautifully detailed bronze mountain goat brooch. Perfect for animal lovers, hikers, and collectors of unique jewelry.Each pin features a steel wire soldered to the back and includes a locking pin clasp to ensure it stays securely attached to jackets, bags, or hatsDimension: 2 x 1 inch.All bronze pin designs are also available in Sterling Silver. Please note that there may be a lead time of up to 3 weeks, as these items will be cast to order.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Bronze Beaver Vertebrae (pin)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Bronze Beaver Vertebrae', 35, 'Bronze Beaver vertebrae. This item is crafted from a direct mold of a beaver vertebra.Each pin incorporates a steel wire that is securely soldered to the back, complete with a locking pin clasp to ensure safe attachment to jackets, bags, or hats.Dimensions: 1.5 x 0.7 inches.All bronze pin designs are also available in Sterling Silver. Please note that there may be a lead time of up to 3 weeks, as these items will be cast to order.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Side Profile Skull Metal Pin
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Side Profile Skull Metal Pin', 35, 'Add a bold statement to your outfit with this finely crafted skull metal pin. Perfect for denim jackets, backpacks, or hats, this accessory features detailed, realistic skull design and durable construction. Great for anyone seeking a touch of punk or gothic style.Each pin features a steel wire soldered to the back and includes a locking pin clasp.Dimensions: 1 x 1/2 inchAll bronze pin designs are also available in Sterling Silver. Please note that there may be a lead time of up to 3 weeks.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Giraffe Skull Lapel Pin
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Giraffe Skull Lapel Pin', 35, 'Stand out with this intricately crafted bronze lapel pin, designed to resemble an animal skull. Perfect for collectors, fashion enthusiasts, or anyone who appreciates unique accessories. The sturdy pin clasp ensures secure attachment to jackets, bags, or hats.Each pin features a steel wire soldered to the back and includes a locking pin clasp.Dimension: 1 x 1/2 inch.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Elk Antler Lapel Pin
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Elk Antler Lapel Pin', 35, 'This handcrafted lapel pin features a striking deer antler design, perfect for nature lovers and outdoor enthusiasts. Crafted from durable metal with secure backing, it adds a unique, rustic touch to jackets, hats, or bags.Each pin features a steel wire soldered to the back and includes a locking pin clasp.Dimension: 1 x 1.5 inch.All bronze pin designs are also available in Sterling Silver. Please note that there may be a lead time of up to 3 weeks.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Crocodile Lapel Pin
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Crocodile Lapel Pin', 35, 'Show off your wild side with this playful Crocodile Lapel Pin. Crafted with attention to detail, this accessory features a detailed crocodile figure, perfect for adding a quirky touch to jackets, bags, or hats. Its secure backing ensures it stays in place all day long.Each pin features a steel wire soldered to the back and includes a locking pin clasp.Dimension: 1.25 x 1/2 inch.All bronze pin designs are also available in Sterling Silver. Please note that there may be a lead time of up to 3 weeks.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Bronze Coyote Skull (pin)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Bronze Coyote Skull', 35, 'Bronze Coyote Skull pin. An excellent choice for enthusiasts of anatomy and nature.Each pin is crafted with a steel wire securely soldered to the back and is equipped with a locking pin clasp.Dimensions: 1 x 1/2 inch.All bronze pin designs are also available in Sterling Silver. Please note that there may be a lead time of up to 3 weeks.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Crow Skull (pin)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Crow Skull', 35, 'Elevate your look with this intricately crafted bronze bird skull lapel pin. Perfect for adding a touch of dark elegance to jackets, bags, or hats. Durable, stylish, and sure to stand out at any event.Each pin features a steel wire soldered to the back and includes a locking pin clasp.Dimension: 1.75 x 1/2 inch.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

  -- Human Skull Bronze Pin
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Human Skull Bronze Pin', 35, 'Solid bronze human skull pin.Each pin is expertly crafted with a steel wire soldered to the back, featuring a secure locking pin clasp.Dimensions: 3/4 x 1/2 inch.', true, ARRAY[4], ARRAY[4], ARRAY[2])
  RETURNING id INTO p_id;

-- ============================================================
-- OTHER (home decor, apparel, stickers — set categories manually)
-- ============================================================

  -- Bronze Krampus Stocking Holder
  -- Note: has size variants (Regular/Large) — add to product_variants manually
  -- using whatever size_chart_id applies to home decor in your DB
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Bronze Krampus Stocking Holder', 150, 'Add a touch of mystery and enchantment to your space with this handcrafted Krampus bronze stocking holder. Featuring intricate detailing and a striking horned design, this piece captures the essence of myth and fantasy, perfect for accenting your home, office, or studio. Durable and eye-catching, it makes a unique gift for lovers of mythology and fantasy art.The large Krampus measures at 4 Inches long.', true, ARRAY[]::integer[]::integer[], ARRAY[]::integer[]::integer[], ARRAY[2])
  RETURNING id INTO p_id;

  -- Solid Bronze Cat Skull
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Solid Bronze Cat Skull', 160, 'Bring a unique and intriguing touch to your interior decor with this solid Bronze Cat skull replica. Crafted for realism and coated with a stunning metallic finish, this piece serves as a fascinating accent for desks, shelves, or display cases. Perfect for collectors, artists, or anyone who appreciates unusual art, it makes a bold statement in any space.The skull comes in two pieces, it measures 2.5 x 2 inches', true, ARRAY[]::integer[]::integer[], ARRAY[]::integer[]::integer[], ARRAY[2])
  RETURNING id INTO p_id;

  -- Heavy Metal Casting Sticker (4x2.75 inch)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Heavy Metal Casting Sticker', 5, 'Showcase your love for metalwork and gothic aesthetics with this striking ''Heavy Metal Casting'' sticker. Featuring detailed skeletons, molten metal pots, and a bold bird skull centerpiece, this high-quality print adds character to workshops, studios, or living spaces.Designed by long time Santa Cruz resident Wyatt Hesemeyer, now situated out of Gainesville, Florida.Size 4 x 2.75 Inch', true, ARRAY[]::integer[]::integer[], ARRAY[]::integer[]::integer[], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Heave Metal Casting Sticker (3x2 inch — note: typo in original handle)
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Heavy Metal Casting Sticker (3x2)', 5, 'Showcase your love for metalwork and gothic aesthetics with this striking ''Heavy Metal Casting'' sticker. Featuring detailed skeletons, molten metal pots, and a bold bird skull centerpiece, this high-quality print adds character to workshops, studios, or living spaces.Size 3x2 inches', true, ARRAY[]::integer[]::integer[], ARRAY[]::integer[]::integer[], ARRAY[]::integer[])
  RETURNING id INTO p_id;

  -- Heavy Metal Casting Graphic T-Shirt
  -- Note: has size variants (s/m/l/xl) — add to product_variants manually
  INSERT INTO products (name, price, description, live, product_categories, size_chart, metal_types)
  VALUES ('Heavy Metal Casting Graphic T-Shirt', 30, 'Stand out from the crowd with this vibrant Heavy Metal Casting Graphic T-Shirt. Featuring a unique and spirited illustration inspired by heavy metal and industrial themes. The print is only located on the front, and the back is blank. Printed locally by Low Brow Screen printing.Design by local artist Derek Pratt, situated out of F-U Tattoo in Santa Cruz, California.', true, ARRAY[]::integer[]::integer[], ARRAY[]::integer[]::integer[], ARRAY[]::integer[])
  RETURNING id INTO p_id;

END;
$$;
