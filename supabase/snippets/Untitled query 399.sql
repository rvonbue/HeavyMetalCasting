-- Remove old policies
DROP POLICY IF EXISTS "user_read_own_orders" ON orders;
DROP POLICY IF EXISTS "admin_read_all_orders" ON orders;
DROP POLICY IF EXISTS "user_create_orders" ON orders;
DROP POLICY IF EXISTS "user_update_own_orders" ON orders;

-- New policies with user_id
CREATE POLICY "user_read_own_orders" ON orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "admin_read_all_orders" ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "user_create_orders" ON orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_update_own_orders" ON orders FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());