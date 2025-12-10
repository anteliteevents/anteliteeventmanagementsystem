const bcrypt = require('bcryptjs');
const pool = require('../dist/config/database').default;

const ADMIN_EMAIL = 'admin88759551@antelite.digital';
const ADMIN_PASSWORD = '94lUYIQ1csnXs1x';

async function verifyAndFixAdmin() {
  try {
    console.log('🔍 Checking admin user...');
    
    // Check if user exists
    const userResult = await pool.query(
      'SELECT id, email, password_hash, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found. Creating...');
      
      // Generate password hash
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      // Create user
      const insertResult = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         RETURNING id, email, first_name, last_name, role, is_active`,
        [ADMIN_EMAIL, passwordHash, 'Admin', 'User', 'admin', true]
      );
      
      console.log('✅ User created:', insertResult.rows[0]);
    } else {
      const user = userResult.rows[0];
      console.log('✅ User found:', {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_active: user.is_active
      });
      
      // Test password
      console.log('\n🔐 Testing password...');
      const isValid = await bcrypt.compare(ADMIN_PASSWORD, user.password_hash);
      
      if (!isValid) {
        console.log('❌ Password doesn\'t match. Updating...');
        
        // Generate new password hash
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
        
        // Update user
        await pool.query(
          `UPDATE users 
           SET password_hash = $1, 
               first_name = COALESCE(first_name, 'Admin'),
               last_name = COALESCE(last_name, 'User'),
               is_active = true,
               updated_at = NOW()
           WHERE email = $2`,
          [passwordHash, ADMIN_EMAIL]
        );
        
        console.log('✅ Password updated');
      } else {
        console.log('✅ Password is correct');
      }
      
      // Ensure user is active
      if (!user.is_active) {
        console.log('⚠️  User is inactive. Activating...');
        await pool.query(
          'UPDATE users SET is_active = true, updated_at = NOW() WHERE email = $1',
          [ADMIN_EMAIL]
        );
        console.log('✅ User activated');
      }
    }
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const finalResult = await pool.query(
      'SELECT email, first_name, last_name, role, is_active FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );
    
    if (finalResult.rows.length > 0) {
      const user = finalResult.rows[0];
      console.log('✅ Admin user ready:', user);
      console.log('\n📋 Login credentials:');
      console.log('   Email:', ADMIN_EMAIL);
      console.log('   Password:', ADMIN_PASSWORD);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyAndFixAdmin();

