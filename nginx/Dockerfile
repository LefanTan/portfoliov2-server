FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx-certificate.crt /etc/nginx/certificate/
COPY ./nginx.key /etc/nginx/certificate/
CMD ["nginx", "-g", "daemon off;"]