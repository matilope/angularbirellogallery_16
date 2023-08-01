export interface InstagramObservable {
  data: Instagram[];
  paging?: Paging;
}

export interface Instagram {
  caption?: string;
  media_url: string;
  media_type: string;
  permalink: string;
  timestamp: string;
  username: string;
  id: string;
}

export interface Paging {
  cursors?: Cursors;
  next?: string;
}

export interface Cursors {
  before?: string;
  after?: string;
}

