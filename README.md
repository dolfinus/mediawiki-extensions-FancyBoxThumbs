# FancyBoxThumbs

Replaces MediaWiki `div.mw-file-description` with a fancy component.

## LocalSettings.php

```php
wfLoadExtension( 'FancyBoxThumbs');
$fbtFancyBoxOptions = '{"openEffect":"elastic","closeEffect":"elastic","helpers":{"title":{"type":"inside"}}}';
```
