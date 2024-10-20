import { Injectable } from '@nestjs/common';
import { GoogleChatHttpClientService } from './google-chat-http.service';
import { BASE_URL } from '../constants';
import { ConfigService } from '@nestjs/config';
import { ConfigurationBase } from '@config';
import { Card, GoogleChatMessage } from './google-chat.interface';

export type GMessage = {
  space: string;
  key: string;
  token: string;
  text: string;
};

@Injectable()
export class AlertService {
  isSending: boolean;
  path: string;
  constructor(
    private readonly googleChatHttpClient: GoogleChatHttpClientService,
    private readonly configService: ConfigService<ConfigurationBase>,
  ) {
    const googleConfig = this.configService.get('alert');
    this.isSending = googleConfig && this.configService.get('isProduction');
    this.path = `/spaces/${googleConfig!.chatSpace}/messages?key=${googleConfig?.chatKey}&token=${googleConfig!.chatToken}`;

    this.googleChatHttpClient.setContextInfo({
      baseURL: BASE_URL,
      headers: {},
    });
  }

  private sendErrorLogMessage({
    time,
    typeError,
    cid,
    status,
    message,
    errorCode,
    url,
    userId,
  }: GoogleChatMessage): Card {
    return {
      cardId: cid,
      card: {
        header: {
          title: `${typeError} at ${this.configService.get('serverName') || 'dev'}`,
          subtitle: `CID: ${cid}`,
          // imageUrl: 'https://developers.google.com/workspace/chat/images/quickstart-app-avatar.png',
          // imageType: 'CIRCLE',
        },
        sections: [
          {
            header: `Status: ${status}`,
            collapsible: true,
            uncollapsibleWidgetsCount: 1,
            widgets: [
              {
                decoratedText: {
                  startIcon: {
                    materialIcon: {
                      name: 'person',
                    },
                  },
                  text: userId ?? 'N/A',
                },
              },
              {
                decoratedText: {
                  startIcon: {
                    materialIcon: {
                      name: 'link',
                    },
                  },
                  text: url ?? 'N/A',
                },
              },
              {
                decoratedText: {
                  startIcon: {
                    materialIcon: {
                      name: 'sos',
                    },
                  },
                  text: errorCode,
                },
              },
              {
                decoratedText: {
                  startIcon: {
                    knownIcon: 'CLOCK',
                  },
                  text: time,
                },
              },
              {
                decoratedText: {
                  startIcon: {
                    knownIcon: 'DESCRIPTION',
                  },
                  wrapText: true,
                  text: message,
                },
              },
            ],
          },
        ],
      },
    };
  }

  async sendCustomText(payLoad: Array<GoogleChatMessage>) {
    if (!payLoad.length || !this.isSending) return;

    const cardsV2 = payLoad.map((item) => {
      return this.sendErrorLogMessage(item);
    });

    return this.googleChatHttpClient
      .post(this.path, {
        cardsV2,
      })
      .catch(() => {});
  }

  async sendText(text: string) {
    if (!text || !this.isSending) return;

    return this.googleChatHttpClient
      .post(this.path, {
        text,
      })
      .catch(() => {});
  }
}
