from rest_framework import serializers
from .models import Pedido, ProdutoPedido

class ProdutoPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoPedido
        fields = ('id', 'nome', 'qtd', 'valorUnit')

class PedidoSerializer(serializers.ModelSerializer):
    materiais = ProdutoPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ('id', 'cliente', 'responsavel', 'endereco', 'tipo', 'status', 'data', 'materiais')

    def create(self, validated_data):
        materiais_data = validated_data.pop('materiais', [])
        pedido = Pedido.objects.create(**validated_data)
        for m in materiais_data:
            ProdutoPedido.objects.create(pedido=pedido, **m)
        return pedido

    def update(self, instance, validated_data):
        materiais_data = validated_data.pop('materiais', None)

        # atualiza campos simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # sincroniza materiais: estratégia simples - apagar e recriar
        if materiais_data is not None:
            instance.materiais.all().delete()
            for m in materiais_data:
                ProdutoPedido.objects.create(pedido=instance, **m)

        return instance
