from django.contrib import admin
from .models import Cliente

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "cliente", "responsavel", "cidade", "contato")
    search_fields = ("cliente", "responsavel", "contato", "bairro", "cidade")
