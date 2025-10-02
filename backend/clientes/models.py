from django.db import models
from django.utils import timezone

class Cliente(models.Model):
    cliente = models.CharField(max_length=200)
    responsavel = models.CharField(max_length=200, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    numero = models.CharField(max_length=10, blank=True, null=True)
    bairro = models.CharField(max_length=100, blank=True, null=True)
    cidade = models.CharField(max_length=100)
    contato = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)  # apenas default

    def __str__(self):
        return self.cliente
