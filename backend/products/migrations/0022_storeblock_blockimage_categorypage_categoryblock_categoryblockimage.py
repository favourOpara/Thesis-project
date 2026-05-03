from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0021_product_discount_percentage'),
    ]

    operations = [
        migrations.CreateModel(
            name='StoreBlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('block_type', models.CharField(
                    choices=[('products', 'Products Grid'), ('text', 'Text Block'), ('image_grid', 'Image Grid')],
                    default='products', max_length=20,
                )),
                ('order', models.PositiveIntegerField(default=0)),
                ('text_title', models.CharField(blank=True, max_length=200, null=True)),
                ('text_content', models.TextField(blank=True, null=True)),
                ('layout', models.CharField(
                    blank=True, max_length=10, null=True,
                    choices=[
                        ('1col', 'Single image (full width)'),
                        ('2col', 'Two columns'),
                        ('3col', 'Three columns'),
                        ('2-1', 'Large left + small right'),
                        ('1-2', 'Small left + large right'),
                    ],
                )),
                ('shop', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='store_blocks',
                    to='products.shop',
                )),
            ],
            options={'ordering': ['order', 'id']},
        ),
        migrations.CreateModel(
            name='BlockImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='store_blocks/')),
                ('linked_category', models.CharField(blank=True, max_length=255, null=True)),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('block', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='images',
                    to='products.storeblock',
                )),
            ],
            options={'ordering': ['display_order', 'id']},
        ),
        migrations.CreateModel(
            name='CategoryPage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category_name', models.CharField(max_length=255)),
                ('shop', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='category_pages',
                    to='products.shop',
                )),
            ],
            options={'unique_together': {('shop', 'category_name')}},
        ),
        migrations.CreateModel(
            name='CategoryBlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('block_type', models.CharField(
                    choices=[('text', 'Text Block'), ('image_grid', 'Image Grid')],
                    default='text', max_length=20,
                )),
                ('order', models.PositiveIntegerField(default=0)),
                ('text_title', models.CharField(blank=True, max_length=200, null=True)),
                ('text_content', models.TextField(blank=True, null=True)),
                ('layout', models.CharField(blank=True, max_length=10, null=True)),
                ('category_page', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='blocks',
                    to='products.categorypage',
                )),
            ],
            options={'ordering': ['order', 'id']},
        ),
        migrations.CreateModel(
            name='CategoryBlockImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='category_blocks/')),
                ('linked_category', models.CharField(blank=True, max_length=255, null=True)),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('block', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='images',
                    to='products.categoryblock',
                )),
            ],
            options={'ordering': ['display_order', 'id']},
        ),
    ]
