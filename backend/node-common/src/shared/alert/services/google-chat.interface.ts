export interface CardHeader {
  title: string;
  subtitle: string;
  imageUrl?: string;
  imageType?: string;
}

export interface KeyValueWidget {
  keyValue: {
    topLabel: string;
    content: string;
  };
}

export interface CardSection {
  widgets: any[];
}

export interface Card {
  cardId: string;
  card: { header: CardHeader; sections: { widgets: any[]; [key: string]: any }[] };
}

export interface ConfigGoogleChat {
  space: string;
  key: string;
  token: string;
  appName: string;
}

export type GoogleChatMessage = {
  typeError: string;
  cid: string;
  status: string;
  message: string;
  time: number | string;
  errorCode: string;
  url?: string;
  userId?: number | string;
};
