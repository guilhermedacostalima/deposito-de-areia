from django.urls import path
from .views import ClienteListCreate, ClienteRetrieve

urlpatterns = [
    path('', ClienteListCreate.as_view(), name='clientes-list-create'),   # GET list (with ?q=) / POST create
    path('<int:pk>/', ClienteRetrieve.as_view(), name='cliente-detail'),  # GET detail
]
