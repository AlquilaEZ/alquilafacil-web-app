export class LocalResponse {
  constructor({id, streetAddress, localName, cityPlace, nightPrice, photoUrl, descriptionMessage, localCategoryId, userId, userUsername, features, capacity}) {
    this.id = id;
    this.streetAddress = streetAddress;
    this.localName = localName;
    this.cityPlace = cityPlace;
    this.nightPrice = nightPrice;
    this.photoUrl = photoUrl;
    this.descriptionMessage = descriptionMessage;
    this.localCategoryId = localCategoryId;
    this.userId = userId;
    this.userUsername = userUsername;
    this.features = features;
    this.capacity = capacity;
  }
}