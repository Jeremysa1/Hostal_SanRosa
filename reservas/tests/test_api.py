from datetime import timedelta

from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from reservas.models import Reserva
from reservas.validators import hoy

from .factories import crear_admin, crear_habitacion, crear_reserva


class BaseAPITest(APITestCase):
    def setUp(self):
        cache.clear()  # reinicia los contadores de throttling
        self.habitacion = crear_habitacion()
        self.entrada = hoy() + timedelta(days=2)
        self.salida = self.entrada + timedelta(days=2)

    def como_admin(self):
        self.client.force_authenticate(crear_admin())


class HabitacionesAPITests(BaseAPITest):
    def test_listado_publico_sin_limite_de_reservas(self):
        # Antes este endpoint usaba el throttle de reservas (5/hora): la sexta
        # visita al listado devolvía 429.
        for _ in range(7):
            self.assertEqual(self.client.get(reverse('habitacion-list')).status_code, 200)

    def test_disponibilidad(self):
        url = reverse('habitacion-disponibilidad', args=[self.habitacion.id])
        params = {'fecha_entrada': self.entrada, 'fecha_salida': self.salida}
        self.assertTrue(self.client.get(url, params).data['disponible'])

        crear_reserva(self.habitacion, entrada_en=2, noches=1)
        respuesta = self.client.get(url, params).data
        self.assertFalse(respuesta['disponible'])
        self.assertEqual(respuesta['reservas_conflicto'], 1)

    def test_disponibilidad_parametros_invalidos(self):
        url = reverse('habitacion-disponibilidad', args=[self.habitacion.id])
        self.assertEqual(self.client.get(url).status_code, 400)
        self.assertEqual(self.client.get(url, {'fecha_entrada': 'x', 'fecha_salida': 'y'}).status_code, 400)


class PreReservaAPITests(BaseAPITest):
    def datos(self, **kwargs):
        datos = {
            'guestName': 'Ana', 'numberOfPeople': 2, 'phoneNumber': '300',
            'checkInDate': self.entrada, 'checkOutDate': self.salida, 'roomType': 'Doble',
        }
        datos.update(kwargs)
        return datos

    def test_devuelve_url_whatsapp(self):
        respuesta = self.client.post(reverse('pre_reserva'), self.datos(), format='json')
        self.assertEqual(respuesta.status_code, 200)
        self.assertIn('https://wa.me/', respuesta.data['whatsapp_url'])
        self.assertEqual(Reserva.objects.count(), 0)

    def test_validaciones(self):
        for datos in (
            self.datos(numberOfPeople=0),
            self.datos(checkOutDate=self.entrada),
            self.datos(checkInDate=hoy() - timedelta(days=1)),
        ):
            with self.subTest(datos=datos):
                respuesta = self.client.post(reverse('pre_reserva'), datos, format='json')
                self.assertEqual(respuesta.status_code, 400)


class ReservasAPITests(BaseAPITest):
    def datos(self, **kwargs):
        datos = {
            'habitacion': self.habitacion.id, 'fecha_entrada': self.entrada,
            'fecha_salida': self.salida, 'numero_personas': 2, 'precio_total': 90000,
            'cliente_nombre': 'Ana', 'cliente_email': 'ana@example.com', 'cliente_telefono': '300',
        }
        datos.update(kwargs)
        return datos

    def test_crear_reserva_publica(self):
        respuesta = self.client.post(reverse('reserva-list'), self.datos(), format='json')
        self.assertEqual(respuesta.status_code, 201, respuesta.data)
        self.assertEqual(respuesta.data['reserva']['cliente']['email'], 'ana@example.com')

    def test_no_permite_doble_reserva(self):
        self.client.post(reverse('reserva-list'), self.datos(), format='json')
        respuesta = self.client.post(reverse('reserva-list'), self.datos(), format='json')
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn('ya está reservada', respuesta.data['non_field_errors'][0])

    def test_listado_solo_admin(self):
        self.assertIn(self.client.get(reverse('reserva-list')).status_code, (401, 403))
        self.como_admin()
        self.assertEqual(self.client.get(reverse('reserva-list')).status_code, 200)


class CalendarioAPITests(BaseAPITest):
    def test_requiere_admin(self):
        self.assertIn(self.client.get(reverse('calendario')).status_code, (401, 403))

    def test_calendario_mes(self):
        self.como_admin()
        respuesta = self.client.get(reverse('calendario'), {'mes': 2, 'anio': 2030})
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data['total_dias'], 28)

    def test_calendario_parametros_invalidos_devuelven_400(self):
        self.como_admin()
        for params in ({'mes': 'abc'}, {'mes': 13}, {'anio': 1990}):
            with self.subTest(params=params):
                self.assertEqual(self.client.get(reverse('calendario'), params).status_code, 400)

    def test_calendario_habitacion(self):
        # Antes fallaba con 500: las fechas llegaban como texto a la función.
        self.como_admin()
        url = reverse('calendario-habitacion', args=[self.habitacion.id])
        respuesta = self.client.get(url, {'fecha_inicio': self.entrada, 'fecha_fin': self.salida})
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(len(respuesta.data['disponibilidad']), 3)

    def test_crear_reserva_desde_calendario(self):
        # Antes fallaba con 500 (self.instance era None al crear).
        self.como_admin()
        datos = {
            'habitacion': self.habitacion.id, 'fecha_entrada': self.entrada,
            'fecha_salida': self.salida, 'numero_personas': 1, 'precio_total': 1000,
            'estado': 'confirmada',
            'cliente_nombre': 'Luis', 'cliente_email': 'luis@example.com', 'cliente_telefono': '301',
        }
        respuesta = self.client.post(reverse('calendario-reserva-list'), datos, format='json')
        self.assertEqual(respuesta.status_code, 201, respuesta.data)
        self.assertEqual(respuesta.data['cliente_info']['nombre'], 'Luis')
        self.assertEqual(respuesta.data['estado'], 'confirmada')

    def test_crear_desde_calendario_exige_cliente(self):
        self.como_admin()
        datos = {
            'habitacion': self.habitacion.id, 'fecha_entrada': self.entrada,
            'fecha_salida': self.salida, 'numero_personas': 1, 'precio_total': 1000,
        }
        respuesta = self.client.post(reverse('calendario-reserva-list'), datos, format='json')
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn('cliente_email', respuesta.data)

    def test_completar_reserva_pasada(self):
        # Antes era imposible: la validación rechazaba la fecha de entrada pasada.
        self.como_admin()
        reserva = crear_reserva(self.habitacion, entrada_en=-3, noches=1)
        url = reverse('calendario-reserva-detail', args=[reserva.id])
        respuesta = self.client.patch(url, {'estado': 'completada'}, format='json')
        self.assertEqual(respuesta.status_code, 200, respuesta.data)
        reserva.refresh_from_db()
        self.assertEqual(reserva.estado, 'completada')


class InformacionHostalAPITests(BaseAPITest):
    def test_informacion_publica(self):
        respuesta = self.client.get(reverse('informacion-hostal'))
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(len(respuesta.data['espacios_comunes']), 3)
        self.assertEqual(respuesta.data['ubicacion_completa'], 'Santa Rosa de Cabal, Risaralda')


class EsquemaAPITests(APITestCase):
    def test_schema_openapi_se_genera(self):
        self.assertEqual(self.client.get(reverse('schema')).status_code, 200)
