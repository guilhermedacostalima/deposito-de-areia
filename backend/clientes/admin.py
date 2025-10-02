from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'cidade', 'contato', 'created_at')
    list_filter = ('cidade',)
    search_fields = ('cliente', 'responsavel', 'contato', 'id')
    ordering = ('-id',)
