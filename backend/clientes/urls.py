from django.urls import path
from .views import ClienteListCreate, ClienteRetrieveUpdateDestroy

urlpatterns = [
    path("clientes/", ClienteListCreate.as_view(), name="lista_clientes"),
    path("clientes/<int:pk>/", ClienteRetrieveUpdateDestroy.as_view(), name="cliente_detail"),
]
