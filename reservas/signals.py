"""
Sincronización de imágenes con Cloudinary.

Cuando una imagen se reemplaza o se borra el registro, se elimina el archivo
anterior en Cloudinary para no acumular archivos huérfanos. Los modelos declaran
qué campos sincronizar en el atributo ``CAMPOS_IMAGEN``.
"""

import logging

import cloudinary.uploader
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import Habitacion, InformacionHostal

logger = logging.getLogger(__name__)

MODELOS_CON_IMAGENES = (Habitacion, InformacionHostal)


def _public_id(valor):
    """Obtiene el public_id de un valor de CloudinaryField (recurso o string)."""
    if not valor:
        return None
    return getattr(valor, 'public_id', None) or str(valor)


def _eliminar_de_cloudinary(public_id):
    if not public_id:
        return
    try:
        cloudinary.uploader.destroy(public_id)
        logger.info("Imagen eliminada de Cloudinary: %s", public_id)
    except Exception:  # noqa: BLE001 - un fallo externo no debe romper el guardado
        logger.exception("No se pudo eliminar la imagen %s de Cloudinary", public_id)


def eliminar_imagenes_reemplazadas(sender, instance, **kwargs):
    if not instance.pk:
        return
    anterior = sender.objects.filter(pk=instance.pk).first()
    if anterior is None:
        return
    for campo in sender.CAMPOS_IMAGEN:
        id_anterior = _public_id(getattr(anterior, campo))
        if id_anterior and id_anterior != _public_id(getattr(instance, campo)):
            _eliminar_de_cloudinary(id_anterior)


def eliminar_imagenes_del_registro(sender, instance, **kwargs):
    for campo in sender.CAMPOS_IMAGEN:
        _eliminar_de_cloudinary(_public_id(getattr(instance, campo)))


for _modelo in MODELOS_CON_IMAGENES:
    receiver(pre_save, sender=_modelo, dispatch_uid=f'img_reemplazo_{_modelo.__name__}')(
        eliminar_imagenes_reemplazadas
    )
    receiver(post_delete, sender=_modelo, dispatch_uid=f'img_borrado_{_modelo.__name__}')(
        eliminar_imagenes_del_registro
    )
