from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0020_shop_products_position_storecontentsection_sectionimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='discount_percentage',
            field=models.PositiveSmallIntegerField(
                default=0,
                help_text='Discount as a percentage (0 = no discount, max 100)',
            ),
        ),
    ]
