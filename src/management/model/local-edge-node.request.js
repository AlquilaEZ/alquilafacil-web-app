export class LocalEdgeNodeRequest {
  constructor({localId, edgeNodeUrl}) {
    this.localId = localId;
    this.edgeNodeUrl = edgeNodeUrl;
  }
}


export class LocalEdgeNodeUpdateRequest {
  constructor({edgeNodeUrl}) {
    this.edgeNodeUrl = edgeNodeUrl;
  }
}