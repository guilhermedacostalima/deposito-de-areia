from django.db import models

class Pedido(models.Model):
    TIPO_PEDIDO = [('Entrega', 'Entrega'), ('Retirada', 'Retirada')]
    STATUS = [('pendente', 'Pendente'), ('pago', 'Pago'), ('entregue', 'Entregue')]

    cliente = models.CharField(max_length=200)
    responsavel = models.CharField(max_length=200, blank=True)
    endereco = models.JSONField(default=dict)
    tipo = models.CharField(max_length=20, choices=TIPO_PEDIDO, default='Entrega')
    status = models.CharField(max_length=20, choices=STATUS, default='pendente')
    data = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'Pedido {self.id} - {self.cliente}'


class ProdutoPedido(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='materiais', on_delete=models.CASCADE)
    nome = models.CharField(max_length=120)
    qtd = models.FloatField()
    valorUnit = models.FloatField()

    def __str__(self):
        return f'{self.nome} ({self.qtd})'
