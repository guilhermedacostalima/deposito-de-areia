from django.urls import path
from .views import PedidoListCreate, PedidoRetrieveUpdateDestroy

urlpatterns = [
    path('pedidos/', PedidoListCreate.as_view(), name='lista_pedidos'),
    path('pedidos/<int:pk>/', PedidoRetrieveUpdateDestroy.as_view(), name='pedido_detail'),
]
