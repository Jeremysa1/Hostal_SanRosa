from datetime import timedelta
from unittest import mock

from django.core.exceptions import ValidationError
from django.test import TestCase

from reservas import services
from reservas.calendario import generar_calendario_mes, obtener_disponibilidad_habitacion
from reservas.models import InformacionHostal, Reserva
from reservas.validators import hoy, validar_reserva

from .factories import crear_habitacion, crear_reserva


class ReservaQuerySetTests(TestCase):
    def test_solapadas_ignora_canceladas_y_rangos_contiguos(self):
        habitacion = crear_habitacion()
        activa = crear_reserva(habitacion, entrada_en=5, noches=2)
        crear_reserva(habitacion, entrada_en=5, noches=2, estado=Reserva.Estado.CANCELADA)

        qs = Reserva.objects.filter(habitacion=habitacion)
        self.assertEqual(list(qs.solapadas(activa.fecha_entrada, activa.fecha_salida)), [activa])
        # Salir el mismo día que otro entra no es un conflicto.
        self.assertFalse(qs.solapadas(activa.fecha_salida, activa.fecha_salida + timedelta(days=1)).exists())


class ValidacionesTests(TestCase):
    def setUp(self):
        self.habitacion = crear_habitacion(capacidad=2)
        self.entrada = hoy() + timedelta(days=3)

    def test_reserva_valida(self):
        validar_reserva(self.habitacion, self.entrada, self.entrada + timedelta(days=2), 2)

    def test_errores(self):
        casos = [
            (self.entrada, self.entrada, 1),                          # salida == entrada
            (hoy() - timedelta(days=1), self.entrada, 1),             # fecha pasada
            (self.entrada, self.entrada + timedelta(days=31), 1),     # > 30 días
            (self.entrada, self.entrada + timedelta(days=1), 3),      # excede capacidad
        ]
        for entrada, salida, personas in casos:
            with self.subTest(entrada=entrada, salida=salida, personas=personas):
                with self.assertRaises(ValidationError):
                    validar_reserva(self.habitacion, entrada, salida, personas)

    def test_conflicto_y_exclusion_al_editar(self):
        existente = crear_reserva(self.habitacion, entrada_en=3, noches=2)
        with self.assertRaises(ValidationError):
            validar_reserva(self.habitacion, existente.fecha_entrada, existente.fecha_salida, 1)
        validar_reserva(
            self.habitacion, existente.fecha_entrada, existente.fecha_salida, 1, reserva_id=existente.id
        )


class ServiciosTests(TestCase):
    def test_crear_reserva_reutiliza_cliente_por_email(self):
        habitacion = crear_habitacion()
        entrada = hoy() + timedelta(days=1)
        datos = dict(
            cliente_nombre='Ana', cliente_email='ana@example.com', cliente_telefono='300',
            habitacion=habitacion, numero_personas=1, precio_total=100,
        )
        r1 = services.crear_reserva(fecha_entrada=entrada, fecha_salida=entrada + timedelta(days=1), **datos)
        r2 = services.crear_reserva(
            fecha_entrada=entrada + timedelta(days=1), fecha_salida=entrada + timedelta(days=2), **datos
        )
        self.assertEqual(r1.cliente_id, r2.cliente_id)

    def test_url_whatsapp_codifica_el_mensaje(self):
        url = services.construir_url_whatsapp({
            'guestName': 'José Pérez', 'phoneNumber': '300', 'numberOfPeople': 2,
            'roomType': 'Doble & Suite', 'checkInDate': '2030-01-01', 'checkOutDate': '2030-01-02',
        }, numero='571234')
        self.assertTrue(url.startswith('https://wa.me/571234?text='))
        self.assertNotIn(' ', url)
        self.assertNotIn('&', url.split('?text=')[1])
        self.assertIn('%0A', url)

    def test_editar_solo_estado_no_revalida_fechas_pasadas(self):
        habitacion = crear_habitacion()
        reserva = crear_reserva(habitacion, entrada_en=-5, noches=2)
        services.validar_datos_reserva({'estado': Reserva.Estado.COMPLETADA}, reserva=reserva)


class CalendarioTests(TestCase):
    def test_calendario_marca_ocupacion_con_consultas_constantes(self):
        h1, h2 = crear_habitacion(nombre='A'), crear_habitacion(nombre='B')
        reserva = crear_reserva(h1, entrada_en=0, noches=1)
        fecha = reserva.fecha_entrada

        with self.assertNumQueries(2):
            cal = generar_calendario_mes(fecha.month, fecha.year)

        self.assertEqual(cal['total_dias'], len(cal['dias']))
        dia = cal['dias'][fecha.day - 1]
        estados = {e['habitacion_id']: e for e in dia['habitaciones_estado']}
        self.assertFalse(estados[h1.id]['disponible'])
        self.assertEqual(estados[h1.id]['reserva']['id'], reserva.id)
        self.assertTrue(estados[h2.id]['disponible'])

    def test_mes_invalido(self):
        with self.assertRaises(ValueError):
            generar_calendario_mes(13, 2025)

    def test_disponibilidad_por_dias(self):
        habitacion = crear_habitacion()
        reserva = crear_reserva(habitacion, entrada_en=1, noches=1)
        inicio = reserva.fecha_entrada - timedelta(days=1)
        dias = obtener_disponibilidad_habitacion(habitacion.id, inicio, inicio + timedelta(days=2))
        self.assertEqual([d['disponible'] for d in dias], [True, False, True])
        self.assertEqual(obtener_disponibilidad_habitacion(9999, inicio, inicio), [])


class InformacionHostalTests(TestCase):
    def test_registro_unico(self):
        info = InformacionHostal.get_info()
        self.assertEqual(InformacionHostal.get_info().pk, info.pk)

        nuevo = InformacionHostal(**{**InformacionHostal.VALORES_POR_DEFECTO, 'nombre': 'Otro'})
        nuevo.save()
        self.assertEqual(InformacionHostal.objects.count(), 1)
        self.assertEqual(InformacionHostal.get_info().nombre, 'Otro')


class SenalesCloudinaryTests(TestCase):
    @mock.patch('reservas.signals.cloudinary.uploader.destroy')
    def test_borra_imagen_reemplazada_y_al_eliminar(self, destroy):
        habitacion = crear_habitacion(imagen='habitaciones/vieja')
        habitacion.imagen = 'habitaciones/nueva'
        habitacion.save()
        destroy.assert_called_once_with('habitaciones/vieja')

        destroy.reset_mock()
        habitacion.delete()
        destroy.assert_called_once_with('habitaciones/nueva')

    @mock.patch('reservas.signals.cloudinary.uploader.destroy', side_effect=RuntimeError('caído'))
    def test_fallo_de_cloudinary_no_rompe_el_guardado(self, _destroy):
        habitacion = crear_habitacion(imagen='habitaciones/vieja')
        habitacion.imagen = 'habitaciones/nueva'
        with self.assertLogs('reservas.signals', level='ERROR'):
            habitacion.save()
