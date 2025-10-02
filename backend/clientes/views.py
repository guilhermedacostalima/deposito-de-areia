from rest_framework import generics
from django.db.models import Q
from .models import Cliente
from .serializers import ClienteSerializer

class ClienteListCreate(generics.ListCreateAPIView):
    queryset = Cliente.objects.all().order_by("id")
    serializer_class = ClienteSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.GET.get("q", "").strip()
        if q:
            return qs.filter(
                Q(cliente__icontains=q) |
                Q(contato__icontains=q) |
                Q(id__exact=q) |
                Q(responsavel__icontains=q)
            ).order_by("cliente")
        return qs

class ClienteRetrieve(generics.RetrieveAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
