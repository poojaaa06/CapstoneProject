export interface NotFoundContent {
  code: string;
  title: string;
  subtitle: string;
  redirectSeconds: number;
}

export const notFoundContent: NotFoundContent = {
  code: '404',
  title: 'Page Not Found',
  subtitle: "The page you're looking for doesn't exist or has been moved.",
  redirectSeconds: 15,
};
