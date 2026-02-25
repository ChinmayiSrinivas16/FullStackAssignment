export class ErrorInterceptor {
  intercept(err: any) { console.error('API Error', err); }
}
