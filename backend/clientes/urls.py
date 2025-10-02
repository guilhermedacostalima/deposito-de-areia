from django.urls import path
from .views import ClienteListCreate, ClienteRetrieve

urlpatterns = [
    path('', ClienteListCreate.as_view(), name='clientes-list-create'),
    path('<int:pk>/', ClienteRetrieve.as_view(), name='cliente-detail'),
]
