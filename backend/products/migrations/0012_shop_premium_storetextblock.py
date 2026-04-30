from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0011_shop_display_controls_and_featured_products'),
    ]

    operations = [
        migrations.AddField(
            model_name='shop',
            name='is_premium',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='shop',
            name='premium_since',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='shop',
            name='store_video_url',
            field=models.URLField(
                blank=True, null=True,
                help_text='Paste a YouTube or Vimeo URL for your store promo video'
            ),
        ),
        migrations.CreateModel(
            name='StoreTextBlock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=200, null=True)),
                ('content', models.TextField()),
                ('insert_after', models.PositiveIntegerField(
                    default=0,
                    help_text='Show this block after the nth product (0 = before all products)'
                )),
                ('shop', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='text_blocks',
                    to='products.shop'
                )),
            ],
            options={
                'ordering': ['insert_after', 'id'],
            },
        ),
    ]
