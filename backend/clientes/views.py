from rest_framework import generics
from django.db.models import Q
from .models import Cliente
from .serializers import ClienteSerializer


class ClienteListCreate(generics.ListCreateAPIView):
    queryset = Cliente.objects.all().order_by("id")  # ordenar pelo ID garante nextId correto
    serializer_class = ClienteSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.GET.get("q", "").strip()
        limit = self.request.GET.get("limit")

        try:
            limit = int(limit)
        except (TypeError, ValueError):
            limit = 30

        if q:
            # se houver query, faz filtro por cliente, contato, id ou responsável
            return qs.filter(
                Q(cliente__icontains=q) |
                Q(contato__icontains=q) |
                Q(id__exact=q) |
                Q(responsavel__icontains=q)
            ).order_by("cliente")[:limit]
        else:
            # sem query, retorna todos os clientes ordenados pelo ID
            return qs


class ClienteRetrieve(generics.RetrieveAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
