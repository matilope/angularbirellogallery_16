export interface PortraitsObservable {
  status: string,
  portraits: Portrait[]
}

export interface PortraitObservable {
  status: string,
  portrait: Portrait
}

export interface Portrait {
  _id: string,
  date: Date,
  title: string,
  image0url: string
}