FROM nginx:alpine

# Remove existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
COPY ./default.conf /etc/nginx/conf.d/

# Expose the listening port
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
