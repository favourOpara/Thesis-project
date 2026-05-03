from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0022_storeblock_blockimage_categorypage_categoryblock_categoryblockimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='storeblock',
            name='block_type',
            field=models.CharField(
                choices=[
                    ('products',     'Products Grid'),
                    ('text',         'Text Block'),
                    ('image_grid',   'Image Grid'),
                    ('banner',       'Banner'),
                    ('announcement', 'Announcement'),
                    ('video',        'Video'),
                    ('divider',      'Divider'),
                ],
                default='products',
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name='storeblock',
            name='layout',
            field=models.CharField(
                blank=True,
                choices=[
                    ('1col',    'Single image (full width)'),
                    ('2col',    'Two columns'),
                    ('3col',    'Three columns'),
                    ('2-1',     'Large left + small right'),
                    ('1-2',     'Small left + large right'),
                    ('promo',   'Promo (gradient)'),
                    ('sale',    'Sale (red)'),
                    ('info',    'Info (blue)'),
                    ('neutral', 'Neutral (grey)'),
                    ('line',    'Thin line'),
                    ('dots',    'Dotted'),
                    ('space',   'Spacer only'),
                ],
                max_length=20,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name='categoryblock',
            name='block_type',
            field=models.CharField(
                choices=[
                    ('text',         'Text Block'),
                    ('image_grid',   'Image Grid'),
                    ('banner',       'Banner'),
                    ('announcement', 'Announcement'),
                    ('video',        'Video'),
                    ('divider',      'Divider'),
                ],
                default='text',
                max_length=20,
            ),
        ),
        migrations.AlterField(
            model_name='categoryblock',
            name='layout',
            field=models.CharField(
                blank=True,
                choices=[
                    ('1col',    'Single image (full width)'),
                    ('2col',    'Two columns'),
                    ('3col',    'Three columns'),
                    ('2-1',     'Large left + small right'),
                    ('1-2',     'Small left + large right'),
                    ('promo',   'Promo (gradient)'),
                    ('sale',    'Sale (red)'),
                    ('info',    'Info (blue)'),
                    ('neutral', 'Neutral (grey)'),
                    ('line',    'Thin line'),
                    ('dots',    'Dotted'),
                    ('space',   'Spacer only'),
                ],
                max_length=20,
                null=True,
            ),
        ),
    ]
