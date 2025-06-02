export class LocalRequest {
  constructor({
    district,
    street,
    localName,
    country,
    city,
    price,
    photoUrl,
    descriptionMessage,
    localCategoryId,
    userId,
    features,
    capacity,
    noiseLevel,
    smokeDetection,
    restrictedArea,
  }) {
    this.district = district;
    this.street = street;
    this.localName = localName;
    this.country = country;
    this.city = city;
    this.price = parseFloat(price);
    this.photoUrl = photoUrl;
    this.descriptionMessage = descriptionMessage;
    this.localCategoryId = localCategoryId;
    this.userId = userId;
    this.features = features.join(',');
    this.capacity = parseInt(capacity);

    // Nuevos campos:
    this.noiseLevel = noiseLevel ? parseFloat(noiseLevel) : null;
    this.smokeDetection = !!smokeDetection; // asegura booleano
    this.restrictedArea = restrictedArea || null;
  }
}
