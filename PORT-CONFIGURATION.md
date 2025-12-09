# Port Configuration Guide

This project supports automatic port detection and manual port configuration for flexible localhost setup.

## Automatic Port Detection (Default)

By default, the application automatically detects the port from your server environment. This means:

- If you access `http://localhost:8080/Event/sovanara/PreahVihea/`, it will use port 8080
- If you access `http://localhost:3000/Event/sovanara/PreahVihea/`, it will use port 3000
- Works with any port automatically!

## Manual Port Configuration

If you want to force a specific port regardless of the actual server port:

### Option 1: Edit `config/port-config.php`

1. Open `config/port-config.php`
2. Uncomment the `CUSTOM_PORT` line
3. Set your desired port:

```php
define('CUSTOM_PORT', 8080);  // Change 8080 to your desired port
```

### Option 2: Configure Apache/XAMPP Virtual Host

Create a virtual host in XAMPP for a specific port:

1. Open `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
2. Add:

```apache
<VirtualHost *:8080>
    ServerName localhost
    DocumentRoot "C:/xampp/htdocs/Event/sovanara/PreahVihea"
    <Directory "C:/xampp/htdocs/Event/sovanara/PreahVihea">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

3. Update `C:\xampp\apache\conf\httpd.conf` to listen on port 8080:

```apache
Listen 8080
```

4. Restart Apache

## Using Different Ports for Different Projects

### Method 1: Multiple Virtual Hosts (Recommended)

Create separate virtual hosts for each project:

```apache
# Project 1 - Event Management System
<VirtualHost *:8080>
    ServerName event.local
    DocumentRoot "C:/xampp/htdocs/Event/sovanara/PreahVihea"
    <Directory "C:/xampp/htdocs/Event/sovanara/PreahVihea">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# Project 2 - Another Project
<VirtualHost *:8081>
    ServerName project2.local
    DocumentRoot "C:/xampp/htdocs/AnotherProject"
    <Directory "C:/xampp/htdocs/AnotherProject">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Add to `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 event.local
127.0.0.1 project2.local
```

### Method 2: Use Port Configuration File

Each project can have its own `config/port-config.php` with a different port:

**Project 1** (`config/port-config.php`):
```php
define('CUSTOM_PORT', 8080);
```

**Project 2** (`config/port-config.php`):
```php
define('CUSTOM_PORT', 8081);
```

## Testing Your Port Configuration

1. Access your application: `http://localhost:YOUR_PORT/Event/sovanara/PreahVihea/`
2. Check the browser's developer console (F12) → Network tab
3. Verify that all assets (CSS, JS) are loading from the correct port
4. Check that links and redirects use the correct port

## Troubleshooting

### Port Not Detected Correctly

- Clear browser cache
- Check Apache error logs: `C:\xampp\apache\logs\error.log`
- Verify `$_SERVER['SERVER_PORT']` in a test PHP file:
  ```php
  <?php echo $_SERVER['SERVER_PORT']; ?>
  ```

### Assets Not Loading

- Ensure `BASE_URL` includes the port
- Check browser console for 404 errors
- Verify `.htaccess` is working (check Apache `mod_rewrite` is enabled)

### Port Already in Use

- Check which application is using the port:
  ```bash
  netstat -ano | findstr :8080
  ```
- Change to a different port in your configuration
- Or stop the application using that port

## Current Port Detection

The application uses this logic to determine the port:

1. First checks for `CUSTOM_PORT` in `config/port-config.php`
2. Then uses `$_SERVER['SERVER_PORT']` from Apache
3. Falls back to standard ports (80 for HTTP, 443 for HTTPS)

## Example Ports for Multiple Projects

| Project | Port | URL |
|---------|------|-----|
| Event Management | 8080 | http://localhost:8080/Event/sovanara/PreahVihea/ |
| Project 2 | 8081 | http://localhost:8081/Project2/ |
| Project 3 | 8082 | http://localhost:8082/Project3/ |

Each project will automatically use its configured port!

