from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0019_productimage_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='shop',
            name='products_position',
            field=models.CharField(
                choices=[('first', 'Products First'), ('last', 'Products Last')],
                default='first',
                help_text='Whether the products grid appears before or after the custom content section',
                max_length=10,
            ),
        ),
        migrations.CreateModel(
            name='StoreContentSection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('layout', models.CharField(
                    choices=[
                        ('1col', 'Single image (full width)'),
                        ('2col', 'Two columns'),
                        ('3col', 'Three columns'),
                        ('2-1', 'Large left + small right'),
                        ('1-2', 'Small left + large right'),
                    ],
                    default='2col',
                    max_length=10,
                )),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('shop', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='content_sections',
                    to='products.shop',
                )),
            ],
            options={
                'ordering': ['display_order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='SectionImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='store_sections/')),
                ('linked_category', models.CharField(
                    blank=True,
                    help_text="When clicked, filters the store's product list to this category",
                    max_length=255,
                    null=True,
                )),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('section', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='images',
                    to='products.storecontentsection',
                )),
            ],
            options={
                'ordering': ['display_order', 'id'],
            },
        ),
    ]
