from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0023_add_new_block_types'),
    ]

    operations = [
        migrations.AddField(
            model_name='storeblock',
            name='style_config',
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name='categoryblock',
            name='style_config',
            field=models.JSONField(blank=True, default=dict),
        ),
        # Also fix layout max_length while we're here
        migrations.AlterField(
            model_name='storeblock',
            name='layout',
            field=models.CharField(
                blank=True, max_length=20,
                choices=[
                    ('1col', 'Single image (full width)'),
                    ('2col', 'Two columns'),
                    ('3col', 'Three columns'),
                    ('2-1', 'Large left + small right'),
                    ('1-2', 'Small left + large right'),
                    ('promo', 'Promo (gradient)'),
                    ('sale', 'Sale (red)'),
                    ('info', 'Info (blue)'),
                    ('neutral', 'Neutral (grey)'),
                    ('line', 'Thin line'),
                    ('dots', 'Dotted'),
                    ('space', 'Spacer only'),
                ],
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name='categoryblock',
            name='layout',
            field=models.CharField(
                blank=True, max_length=20,
                choices=[
                    ('1col', 'Single image (full width)'),
                    ('2col', 'Two columns'),
                    ('3col', 'Three columns'),
                    ('2-1', 'Large left + small right'),
                    ('1-2', 'Small left + large right'),
                    ('promo', 'Promo (gradient)'),
                    ('sale', 'Sale (red)'),
                    ('info', 'Info (blue)'),
                    ('neutral', 'Neutral (grey)'),
                    ('line', 'Thin line'),
                    ('dots', 'Dotted'),
                    ('space', 'Spacer only'),
                ],
                null=True,
            ),
        ),
    ]
