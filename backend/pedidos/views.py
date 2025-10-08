from rest_framework import viewsets
from .models import Pedido
from .serializers import PedidoSerializer
from rest_framework.permissions import AllowAny  # ajuste se quiser auth

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-data', '-id')
    serializer_class = PedidoSerializer
    permission_classes = [AllowAny]  # em dev OK; em prod troque por IsAuthenticated
