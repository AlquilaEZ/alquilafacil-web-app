export class LocalRequest {
  constructor({district, street, localName, country, city, price, photoUrl, descriptionMessage, localCategoryId, userId, features, capacity}) {
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
  }
}