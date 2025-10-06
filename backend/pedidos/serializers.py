from rest_framework import serializers
from .models import Pedido, MaterialPedido

class MaterialPedidoSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()

    class Meta:
        model = MaterialPedido
        fields = ['id', 'nome', 'quantidade', 'valorUnit', 'total']

    def get_total(self, obj):
        return obj.total()

class PedidoSerializer(serializers.ModelSerializer):
    materiais = MaterialPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'responsavel', 'tipoPedido', 'status', 'data', 'endereco', 'numero', 'bairro', 'cidade', 'contato', 'materiais']

    def create(self, validated_data):
        materiais_data = validated_data.pop('materiais')
        pedido = Pedido.objects.create(**validated_data)
        for mat in materiais_data:
            MaterialPedido.objects.create(pedido=pedido, **mat)
        return pedido

    def update(self, instance, validated_data):
        materiais_data = validated_data.pop('materiais', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if materiais_data is not None:
            # Remove antigos e cria novos
            instance.materiais.all().delete()
            for mat in materiais_data:
                MaterialPedido.objects.create(pedido=instance, **mat)
        return instance
