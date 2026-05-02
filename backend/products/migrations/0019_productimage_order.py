from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0018_product_variants_extra_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='productimage',
            name='order',
            field=models.PositiveIntegerField(default=0, help_text='Display order (lower = earlier)'),
        ),
    ]
