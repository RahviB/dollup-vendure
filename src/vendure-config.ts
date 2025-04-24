import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import 'dotenv/config';
import * as path from 'path';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;

export const config: VendureConfig = {
apiOptions: {
        port: serverPort,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        ...(IS_DEV ? {
            adminApiPlayground: {
                settings: { 'request.credentials': 'include' },
            },
            adminApiDebug: true,
            shopApiPlayground: {
                settings: { 'request.credentials': 'include' },
            },
            shopApiDebug: true,
        } : {}),
    },

    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME,
            password: process.env.SUPERADMIN_PASSWORD,
        },
        cookieOptions: {
            secret: process.env.SESSION_SECRET,
        },
    },
    dbConnectionOptions: {
        type: 'postgres',
        // See the README.md "Migrations" section for an explanation of
        // the `synchronize` and `migrations` options.
        synchronize: true,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.DB_NAME,
        schema: process.env.DB_SCHEMA,
        ssl: {
        rejectUnauthorized: false,
        },
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    // When adding or altering custom field definitions, the database will
    // need to be updated. See the "Migrations" section in README.md.
    customFields: {},
plugins: [
  AssetServerPlugin.init({
    route: 'assets',
    assetUploadDir: path.join(__dirname, '../static/assets'),
    assetUrlPrefix: IS_DEV ? undefined : 'https://admin.dollupboutique.com/assets/',
  }),

AdminUiPlugin.init({
  route: 'admin',
  port: serverPort + 2,
  app: compileUiExtensions({
    outputPath: path.join(__dirname, '../admin-ui'),
    extensions: [],
  }),
  adminUiConfig: {
    apiPort: serverPort,
  },
}),

  DefaultJobQueuePlugin.init({
    useDatabaseForBuffer: true,
  }),

  DefaultSearchPlugin.init({
    bufferUpdates: false,
    indexStockStatus: true,
  }),

  EmailPlugin.init({
    devMode: true,
    outputPath: path.join(__dirname, '../static/email/test-emails'),
    route: 'mailbox',
    handlers: defaultEmailHandlers,
    templateLoader: new FileBasedTemplateLoader(
      path.join(__dirname, '../static/email/templates')
    ),
    globalTemplateVars: {
      fromAddress: `"Example" <noreply@example.com>`,
      verifyEmailAddressUrl: 'http://localhost:8080/verify',
      passwordResetUrl: 'http://localhost:8080/password-reset',
      changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change',
    },
  }),
],
};
