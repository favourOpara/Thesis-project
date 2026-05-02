from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0017_shop_premium_expires_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='material_type',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='quantity',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='product',
            name='size',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='product',
            name='variants',
            field=models.JSONField(
                blank=True, null=True,
                help_text='Per-size stock: [{"size": "S", "qty": 5}, {"size": "M", "qty": 3}]'
            ),
        ),
        migrations.AddField(
            model_name='product',
            name='extra_fields',
            field=models.JSONField(
                blank=True, null=True,
                help_text='Category-specific fields: {"storage": "128GB", "ram": "8GB", ...}'
            ),
        ),
    ]
