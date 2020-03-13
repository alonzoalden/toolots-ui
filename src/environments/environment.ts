// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  imageURL: 'https://s3-us-west-2.amazonaws.com/img.staging.toolots.com/catalog/product',
  refurbishURL: 'https://s3-us-west-2.amazonaws.com/img.staging.toolots.com',
  bolURL: 'https://s3-us-west-2.amazonaws.com/img.staging.toolots.com/bol',
  fileURL: 'https://s3-us-west-2.amazonaws.com/img.staging.toolots.com/attachment/file',
  invoiceURL: 'https://s3-us-west-2.amazonaws.com/img.staging.toolots.com/merchantinvoice',
  // imageURL: 'https://staging.toolots.com/media/catalog/product',
  // fileURL: 'https://staging.toolots.com/media/attachment/file',
  linkURL: 'https://staging.toolots.com',
  previewURL: 'https://staging.toolots.com/index.php/catalog/product/view/id/',

  // siteURL: 'https://staging-merchantportal.toolots.com',
  siteURL: 'https://localhost:4200',

  // webapiURL: 'https://webapi.toolots.com/merchantportal',
  webapiURL: 'https://staging-webapi.toolots.com.cn/gadget',
  // webapiURL: 'https://localhost:44360',

  // authIssuer: 'https://login.toolots.com/identity',
  authIssuer: 'https://staging-login.toolots.com.cn/identity',
  // authIssuer: 'https://localhost:44388/identity',

  // authclientId: 'angular'
  // authclientId: 'stagingangular'
  authclientId: 'localangular'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
