from django.db import models
from clientes.models import Cliente

class Pedido(models.Model):
    TIPO_PEDIDO_CHOICES = [
        ('Entrega', 'Entrega'),
        ('Retirada', 'Retirada'),
    ]

    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('entregue', 'Entregue'),
    ]

    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='pedidos')
    responsavel = models.CharField(max_length=100)
    tipoPedido = models.CharField(max_length=10, choices=TIPO_PEDIDO_CHOICES, default='Entrega')
    data = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pendente')

    # Endereço duplicado para facilitar o pedido
    endereco = models.CharField(max_length=255)
    numero = models.CharField(max_length=20, blank=True)
    bairro = models.CharField(max_length=100, blank=True)
    cidade = models.CharField(max_length=100, blank=True)
    contato = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.cliente.cliente}"
class MaterialPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='materiais')
    nome = models.CharField(max_length=50)
    quantidade = models.PositiveIntegerField()
    valorUnit = models.DecimalField(max_digits=10, decimal_places=2)

    def total(self):
        return self.quantidade * self.valorUnit

    def __str__(self):
        return f"{self.nome} ({self.quantidade})"
